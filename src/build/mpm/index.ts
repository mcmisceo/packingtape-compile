import * as fs from 'fs-extra'
import * as path from 'path'

import { pack } from './../../classes/pack'
import { mpm_model } from './../../classes/json_schema/mpm_model'
import { model } from './../../classes/json_schema/minecraft/model'

class output_model {
    id: string
    cmd: number
    old: boolean = undefined
}

export function mpm(packs: Array<pack>) {
    let models_list: Array<Array<mpm_model>>;
    let output_models: Array<output_model>;

    for (let pack of packs) {
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

    for (let models of models_list) {
        for (let model of models) {
            let output_id: string;
            let output_cmd: number = undefined;
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
                id: output_id,
                cmd: output_cmd,
                old: old
            })
        }
    }

    let olds: Array<output_model>;
    for (let [index, model] of Object.entries(output_models)) {
        if (model.old) {
            olds.push(model);
            output_models.slice(parseInt(index))
        }
    }
    output_models = [...olds, ...output_models];
}
