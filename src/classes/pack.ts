import * as fs from "fs-extra";
import * as path from 'path';
import * as hjson from 'hjson';
import { parsed_datapack } from './parsed_datapack'
import { mpm_model } from './mpm_model'

export class pack {
    name: string;
    input_path: string;
    output_path: string;
    id: number;
    description: string;
    data_format: number;
    asset_format: number;
    models: Array<mpm_model>;

    constructor(dp_path: string, id: number) {
        this.name = path.basename(dp_path);
        this.input_path = dp_path;
        this.id = id;
        let data: string;
        try {
            data = fs.readFileSync(path.join(dp_path, 'datapack.jsonc'), 'utf8');
        } catch (err) {
            console.log(err);
            throw 'Invalid Datapack (Missing datapack config file)';
        }
        const datapack: parsed_datapack = hjson.parse(data);
        this.description = datapack.description;
        this.data_format = datapack.data_format;
        this.asset_format = datapack.assets_format;
        this.models = datapack.models;
    }
}