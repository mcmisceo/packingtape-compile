import * as fs from 'fs-extra'
import * as path from 'path'

import { pack } from './../../classes/pack'
import { mpm_model } from './../../classes/json_schema/mpm_model'
import { model } from './../../classes/json_schema/minecraft/model'
import { manifest } from './../../classes/json_schema/manifest'
import { DetailedPeerCertificate } from 'tls';

class output_model {
    pair: string
    id:   string
    cmd:  number
    file: string
    old:  boolean = undefined
}
const item_tree: object = {
    use_detect:  "minecraft:carrot_on_a_stick",
    default: {
        single: "minecraft:carrot_on_a_stick",
        full:   "minecraft:clock",
        '':     "minecraft:clock",
        error:  " has an invalid mpm.default value on ",
    },
    peripheral: {
        pickaxe: "minecraft:wooden_pickaxe",
        axe:     "minecraft:wooden_axe",
        shovel:  "minecraft:wooden_shovel",
        hoe:     "minecraft:wooden_hoe",
        sword:   "minecraft:wooden_sword",
        body: {
            head:  "minecraft:chainmail_helmet",
            chest: "minecraft:chainmail_chestplate",
            legs:  "minecraft:chainmail_leggings",
            feet:  "minecraft:chainmail_boots",
            error: " has an invalid slot for mpm.body on "
        },
        error: " has an invalid mpm item type on "
    },
    error: " has an invalid item on "
}


export function mpm(packs: Array<pack>, compile_from: string, compile_to: string, manifest_path: string) {
    let models_list: Array<Array<mpm_model>> = [];
    let output_models: Array<output_model> = [];



    for (let pack of packs) {
        if (pack.models) {
            if (pack.old) {
                if (pack.old.models == pack.models) {
                    models_list.push(pack.models);
                } else {
                    let models: Array<mpm_model> = pack.old.models.slice();
                    for (let model of pack.models) {
                        for (let [index, old_model] of Object.entries(pack.old.models)) {
                            if (old_model == model) {
                                models.slice(parseInt(index));
                                models.push(model);
                            }
                        }
                    }
                }
            } else {
                models_list.push(pack.models);
            }
        }
    }

    for (let models of models_list) {
        for (let model of models) {
            let output_id: string;
            let output_cmd: number = undefined;
            let output_file: string = path.join(model.namespace, "models", "item", model.id);
            if (model.file) output_file = model.file;
            let old: boolean = false;

            if (!model.old) {
                let mpm_type: boolean = false;
                let namespace: string = model.item.split(':')[0];
                let id: string = model.item.split(':')[1];

                if (namespace = "mpm") {
                    output_id = get_from_item_tree(id.split('.'),item_tree,model.namespace,model.id);
                } else {
                    output_id = id;
                }
            } else {
                output_id = model.old.id;
                output_cmd = model.old.cmd;
                old = true;
            }

            output_models.push({
                pair: model.namespace + ':' + model.id,
                id: output_id,
                cmd: output_cmd,
                file: output_file,
                old: old
            })
        }
    }
    function get_from_item_tree(path: Array<string>, tree: any, namespace: string, id: string) {
        const resolved = tree[path[0]];
        if (!resolved) console.warn("Namespace " + namespace + tree.error + id + ".");
        if (typeof resolved === "object") return get_from_item_tree(path.slice(1),resolved,namespace,id);
        else if (typeof resolved == "string") return resolved;
        else console.warn("Malformed item tree!")
    }




    let olds: Array<output_model> = [];
    for (let [index, model] of Object.entries(output_models)) {
        if (model.old) {
            let collision: boolean = false;
            for (let [index_, model_] of Object.entries(output_models)) {
                if (model.pair == model_.pair && index != index_) collision = true;
            }
            if (!collision) olds.push(model);
            output_models.slice(parseInt(index))
        }
    }
    output_models = [...olds, ...output_models];

    class material {
        material: string
        models: Array<output_model>
    }
    let materials: Array<material> = [];
    for (let model of output_models) {
        let found: boolean = false;
        for (let material of materials) {
            if (material.material == model.id) {
                material.models.push(model)
                found = true;
            }
        }
        if (!found) materials.push({
            material: model.id,
            models: [model]
        });
    }
    output_models = [];
    for (let material of materials) {
        let cmd: number = 1;
        for (let model of material.models) {
            if (model.old) output_models.push(model); else {
                model.cmd = cmd++;
                output_models.push(model);
            }
        }
    }
    for (let output_model of output_models) console.log(output_model);



    // now is when we can parse through all the mcfunctions, loot tables, and advancements [leave comment]
    const mcfunction_file_paths: Array<string> = [];
    const loot_table_file_paths: Array<string> = [];
    const advancement_file_paths: Array<string> = [];
    for (let pack of packs) {
        for (let namespace of fs.readdirSync(path.join(pack.input_path, "data"))) {
            const functions_path = path.join(pack.input_path, "data", namespace, "functions");
            if (fs.existsSync(functions_path)) for (let file of fs.readdirSync(functions_path)) {
                recurse_files(functions_path, file, [".mcfunction"], mcfunction_file_paths);
            }
            const json_exts: Array<string> = [".json", ".jsonc", ".hjson"]
            const loot_tables_path = path.join(pack.input_path, "data", namespace, "loot_tables");
            if (fs.existsSync(loot_tables_path)) for (let file of fs.readdirSync(loot_tables_path)) {
                recurse_files(loot_tables_path, file, json_exts, loot_table_file_paths);
            }
            const advancement_path = path.join(pack.input_path, "data", namespace, "advancements");
            if (fs.existsSync(advancement_path)) for (let file of fs.readdirSync(advancement_path)) {
                recurse_files(advancement_path, file, json_exts, advancement_file_paths);
            }
        }
    }
    function recurse_files(folder: string, file: string, ext: Array<string>, arr: Array<string>) {
        const file_path = path.join(folder, file);
        if (fs.lstatSync(file_path).isDirectory()) {
            for (let file of fs.readdirSync(file_path)) {
                recurse_files(file_path, file, ext, arr);
            }
        } else if (ext.includes(path.extname(file))) {
            //I am the Google God, lmfao [LEAVE COMMENT] ~~entry.split(".")[entry.split(".").length - 1]~~
            arr.push(file_path);
        }
    }
    console.log(mcfunction_file_paths);
    console.log(loot_table_file_paths);
    console.log(advancement_file_paths);

    function readLines(input): Array<string> {
        let remaining = '';
        let output: Array<string> = [];

        remaining += input;
        var index = remaining.indexOf('\n');
        var last = 0;
        while (index > -1) {
            var line = remaining.substring(last, index);
            last = index + 1;
            output.push(line);
            index = remaining.indexOf('\n', last);
        }

        remaining = remaining.substring(last);

        if (remaining.length > 0) {
            output.push(remaining);
        }

        return output;
    }

    for (let mcfunction of mcfunction_file_paths) {
        let function_file: string = fs.readFileSync(mcfunction, {encoding: 'utf8'});

        let lines: Array<string> = readLines(function_file);
        for (let [index, line] of Object.entries(lines)) {
            for (let output_model of output_models) {
                const dollar_finder1: string = '(?:^|[^\\\\])('
                const dollar_finder2: string = '(\\\\\\\\)*\\$'
                /*
                class output_model {//thanks fam
                    pair: string (ie mechanization:foo_bar)
                    id:   string (ie minecraft:carrot_on_a_stick)
                    cmd:  number (the CustomModelData nbt value)
                    file: string (don't mess with)
                    old:  boolean = undefined (don't mess with)
                }
                */
               
                line = line.replace(RegExp(dollar_finder1 + 'id:"' + dollar_finder2 + output_model.pair + '")', 'g'), (match: string)=>{
                    /*
                    Start at match.length
                    Find the closing-brace that ends the current scope
                    Or find the next instance of `tag` that isn't in a quote or deeper scope
                    Proceed with replacement
                    Profit
                    */
                   
                    let depth:number = 0;
                    let inString:boolean = false;
                    let stringChar:string = null;
                    for(let i=match.length; i<line.length; i++){
                        switch(line[i]){
                            case '{': if(!inString) depth++; break;
                            case '}': if(!inString) depth--; break;
                            case '"':
                                if(stringChar !== "'") {
                                    if(stringChar) stringChar = null;
                                    else stringChar = '"';
                                    inString = !inString;
                                }
                                break;
                            case "'":
                                if(stringChar !== '"') {
                                    if(stringChar) stringChar = null;
                                    else stringChar = "'";
                                    inString = !inString;
                                }
                                break;
                        }
                        if(!inString && line[i] + line[i+1] + line[i+2] === "tag") {
                            line = line.slice(0,i+4) + 'CustomModelData:' + output_model.cmd + ',' + line.slice(i+4);
                            return match[0] + 'id:"' + output_model.id + '"';
                        }else if(depth==0) {
                            return match[0] + 'id:"' + output_model.id + '",tag:{CustomModelData:' + output_model.cmd + '\}';
                        }
                    }
                
                }).replace(RegExp(dollar_finder1 + '^give @.+? ' + dollar_finder2 + output_model.pair + ')'), ()=>{
                    return line.match(/^give @.+? /) + output_model.id + '{CustomModelData:' + output_model.cmd + '}';
                }).replace(/\}\{/g,'');
                console.log(line);//Ha, not my fault, thank GOD
               
            }
            lines[index] = line;
        }
        console.log(mcfunction.replace(path.join(compile_to), path.join(compile_from, "datapacks")));
        fs.createFileSync(mcfunction.replace(path.join(compile_to), path.join(compile_from, "datapacks")));
        fs.writeFileSync(mcfunction.replace(path.join(compile_to), path.join(compile_from, "datapacks")), lines.join('\n'));
    }

    for (let material of materials) {
        let namespace: string = material.material.split(":")[0];
        let id: string = material.material.split(":")[1];
        let output = {
            overrides: []
        }
        for(let model of material.models) {
            let output_override = {
                predicate: {
                    custom_model_data: model.cmd
                },
                model: model.pair.split(":")[0] + ':' + model.file
            }
            output.overrides.push(output_override);
            console.log(output_override);
        }
        console.log(material.material)
        console.log(output);
        console.log(path.join(compile_from, "resources", "assets", namespace, "models", "item", id + ".json"));
        //fs.createFileSync(path.join(compile_from, "resources", "assets", namespace, "models", "item", id + ".json"));
        //fs.writeFileSync(path.join(compile_from, "resources", "assets", namespace, "models", "item", id + ".json"), JSON.stringify(output));
    }

    if (manifest_path) { 
        let manifest_edit: manifest
        fs.readFile(manifest_path, "utf-8", (err: any, data: string) => {
            if (err) throw err;
            manifest_edit = JSON.parse(data);
        });
        for (let pack in models_list) {
            if (manifest_edit.packs[pack]) manifest_edit.packs[pack].models = models_list[pack]
            else manifest_edit.packs[pack] = { //Init in the case it doesn't already exist [leave comment]
                packname: null,
                packid: null,
                objectives: null,
                models: models_list[pack]
            };
        }
        fs.writeFile(manifest_path, JSON.stringify(manifest_edit), (err: any) => {
            if (err) throw err;
        })
    }
}
