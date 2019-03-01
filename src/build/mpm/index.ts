import * as fs from 'fs-extra'
import * as path from 'path'

import { pack } from './../../classes/pack'
import { mpm_model } from './../../classes/json_schema/mpm_model'
import { model } from './../../classes/json_schema/minecraft/model'
import { manifest } from './../../classes/json_schema/manifest'

class output_model {
    pair: string
    id: string
    cmd: number
    file: string
    old: boolean = undefined
}

export function mpm(packs: Array<pack>, manifest_path: string) {
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
                    let path = id.split('.');
                    if (path[0] == "use_detect") output_id = "minecraft:carrot_on_a_stick";
                    if (path[0] == "default") if (!path[1]) output_id = "minecraft:clock"; else {
                        if (path[1] == "single") output_id = "minecraft:carrot_on_a_stick";
                        else if (path[1] == "full") output_id = "minecraft:clock"; else {
                            console.warn("Namespace " + model.namespace + " has an invalid mpm.default value on " + model.id + ".")
                        }
                    }
                    if (path[0] == "peripheral") {//USE SWITCH STATEMENTS
                        switch(path[1]) {
                            case "pickaxe": output_id = "minecraft:wooden_pickaxe"; break;
                            case "axe":     output_id = "minecraft:wooden_axe"; break;
                            case "shovel":  output_id = "minecraft:wooden_shovel"; break;
                            case "hoe":     output_id = "minecraft:wooden_hoe"; break;
                            case "sword":   output_id = "minecraft:wooden_sword"; break;
                            case "body":
                                switch(path[2]) {
                                    case "head":  output_id = "minecraft:chainmail_helmet"; break;
                                    case "chest": output_id = "minecraft:chainmail_chestplate"; break;
                                    case "legs":  output_id = "minecraft:chainmail_leggings"; break;
                                    case "feet":  output_id = "minecraft:chainmail_boots"; break;
                                    default: 
                                        if (path[2]) console.warn("Namespace " + model.namespace + " has an invalid slot for mpm.body on " + model.id + ".");
                                        else console.warn("Namespace " + model.namespace + " is missing a slot in mpm.body on " + model.id + ".");
                                        break;
                                }
                                break;
                            default: 
                                console.warn("Namespace " + model.namespace + " has an invalid mpm item type on " + model.id + ".")
                        }
                    }
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
        for (let line of lines) {
            for (let output_model of output_models) {
                if (RegExp('(?:^|[^\\\\])((\\\\\\\\)*\\$' + output_model.pair + ')').test(line)) {
                    console.log("Hit $" + output_model.pair + " in " + mcfunction);
                    // now to parse the command :thy:
                    if (/^([\w\-]+)/.test(line) && line.match(/^([\w\-]+)/)[0] == 'give') {
                        if (!line.includes('{')) line = line.replace(
                            RegExp('(?:^|[^\\\\])((\\\\\\\\)*\\$' + output_model.pair + ')'),
                            ' ' + output_model.id + '{CustomModelData:' + output_model.cmd + '}'); 
                        else if (line.includes('}')) {
                            line = line.replace(
                                RegExp('(?:^|[^\\\\])((\\\\\\\\)*\\$' + output_model.pair + ')'),
                                ' ' + output_model.id
                            )
                            line = line.replace(
                                /.$/,
                                'CustomModelData:' + output_model.cmd + '}'
                            ); // not working yet
                        }
                        console.log(line)
                    }
                    if (/^([\w\-]+)/.test(line) && line.match(/^([\w\-]+)/)[0] == 'setblock') {
                        console.log("foo");
                    }
                }
            }
        }
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
