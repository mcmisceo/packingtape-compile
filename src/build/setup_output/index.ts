import * as fs from "fs-extra"
import * as path from "path"
import { pack } from '../../classes/pack'

export function datapack(dp: pack) {
    const datapack_meta: object = {
        "pack": {
            "description": dp.description,
            "pack_format": dp.data_format
        }
    }
    fs.ensureDirSync(dp.output_path);

    fs.writeFileSync(path.join(dp.output_path, 'pack.mcmeta'), JSON.stringify(datapack_meta));
}

export function resources(output_path: string, assets_format: number) {
    const resources_path: string = path.join(output_path, 'resources');
    const resources_meta: object = {
        "pack": {
            "description": "Packset Compiled Resource",
            "pack_format": assets_format
        }
    }
    fs.ensureDirSync(resources_path);
    fs.writeFileSync(path.join(resources_path, 'pack.mcmeta'), JSON.stringify(resources_meta));
}