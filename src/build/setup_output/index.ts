import * as fs from "fs-extra"
import * as path from "path"
import { pack } from '../../classes/pack'

export function datapack(dp: pack, output_path: string) {
    const dp_path: string = path.join(output_path, dp.name);
    const datapack_meta: object = {
        "pack": {
            "description": dp.description,
            "pack_format": dp.data_format
        }
    }
    dp.output_path = dp_path
    fs.mkdirSync(dp_path);
    fs.writeFileSync(path.join(dp_path, 'pack.mcmeta'), JSON.stringify(datapack_meta));
}

export function resources(output_path: string, assets_format: number) {
    const resources_path: string = path.join(output_path, 'resources');
    const resources_meta: object = {
        "pack": {
            "description": "Packset Compiled Resource",
            "pack_format": assets_format
        }
    }
    fs.mkdirSync(resources_path);
    fs.writeFileSync(path.join(resources_path, 'pack.mcmeta'), JSON.stringify(resources_meta));
}