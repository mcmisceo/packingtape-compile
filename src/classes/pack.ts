import * as fs from "fs-extra";
import * as path from 'path';
import * as hjson from 'hjson';

import { parsed_pack } from './parsed_pack'
import { mpm_model } from './json_schema/mpm_model'
import { ccm_character } from './json_schema/ccm_character'
import { old_pack } from './old_pack'

export class pack {
    name: string;
    input_path: string;
    output_path: string;
    id: number;
    description: string;
    data_format: number;
    asset_format: number;
    models: Array<mpm_model>;
    characters: Array<ccm_character>;
    old: old_pack = undefined;

    constructor(pack_path: string, id: number, old: old_pack) {
        this.name = path.basename(pack_path);
        this.input_path = pack_path;
        this.id = id;
        let data: string;
        const file_name: string = "datapack";
        let file: string;
        const extensions: Array<string> = ["json", "jsonc", "hjson"];
        try {
            for (let extension of extensions) {
                file = file_name + '.' + extension
                if (fs.existsSync(path.join(pack_path, file))) data = fs.readFileSync(path.join(pack_path, file), 'utf8');
            }
        } catch (err) {
            console.log(err);
            throw 'Invalid Pack (Missing pack config file at ' + path.join(pack_path, file) + extensions[0] + '|' + extensions[1] + '|' + extensions[2] + ')';
        }
        const pack: parsed_pack = hjson.parse(data);
        this.description = pack.description;
        this.data_format = pack.data_format;
        this.asset_format = pack.assets_format;
        this.models = pack.models;
        this.characters = pack.characters;
        if (old) this.old = old;
    }
}