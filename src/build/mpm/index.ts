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
                    if (path[0] == "peripheral") {
                        if (path[1] == "pickaxe") output_id = "minecraft:wooden_pickaxe";
                        else if (path[1] == "axe") output_id = "minecraft:wooden_axe";
                        else if (path[1] == "shovel") output_id = "minecraft:wooden_shovel";
                        else if (path[1] == "hoe") output_id = "minecraft:wooden_hoe";
                        else if (path[1] == "sword") output_id = "minecraft:wooden_sword";
                        else if (path[1] == "body") {
                            if (!path[2]) {
                                console.warn("Namespace " + model.namespace + " is missing a slot in mpm.body on " + model.id + ".")
                            }
                            else if (path[2] == "head") output_id = "minecraft:chainmail_helmet";
                            else if (path[2] == "chest") output_id = "minecraft:chainmail_chestplate";
                            else if (path[2] == "legs") output_id = "minecraft:chainmail_leggings";
                            else if (path[2] == "feet") output_id = "minecraft:chainmail_boots";
                            else {
                                console.warn("Namespace " + model.namespace + " has an invalid slot for mpm.body on " + model.id + ".")
                            }
                        }
                        else {
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
    // now is when we can parse through all the mcfunctions, loot tables, and advancements

    for (let pack of packs) {
        let mcfunction_file_paths: Array<string> = [];
        for (let namespace of fs.readdirSync(path.join(pack.input_path, "data"))) {
            for (let functions of fs.readdirSync(path.join(pack.input_path, "data", namespace, "functions"))) {
                for (let entry of functions)
                    if (entry.split(".")[entry.split(".").length - 1] == "mcfunction")
                        mcfunction_file_paths.push(path.join(pack.input_path, "data", namespace, "functions", entry));
            }
        }
    }


    /*let manifest_edit: manifest
    fs.readFile(manifest_path, "utf-8", (err: any, data: string) => {
        if (err) throw err;
        manifest_edit = JSON.parse(data);
    });
    for (let pack in models_list) {
        if (manifest_edit.packs[pack]) manifest_edit.packs[pack].models = manifest_models
        else manifest_edit.packs[pack] = {
            packname: null,
            packid: null,
            objectives: null,
            models: manifest_models
        };
    }
    fs.writeFile(manifest_path, JSON.stringify(manifest_edit), (err: any) => {
        if (err) throw err;
    })*/


}
