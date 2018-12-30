import * as fs from "fs";
import * as path from 'path';
import * as hjson from 'hjson';

export class pack {
    name: string;
    path: string;
    id: number;
    description: string;
    data_format: number;
    asset_format: number;
    models: Array<object>;

    constructor(dp_path: string, id: number) {
        this.name = path.basename(dp_path);
        this.path = dp_path;
        this.id = id;
        fs.readFile(path.join(dp_path, 'datapack.jsonc'), 'utf8', (err, data: string) => {
            if (err) throw 'Invalid Datapack (Missing datapack.jsonc)';
            const datapackjs: object = hjson.parse(data);
            this.description = datapackjs['description'];
            this.data_format = datapackjs['data-format'];
            this.asset_format = datapackjs['assets-format'];
            this.models = datapackjs['models'];
        });
    }
}