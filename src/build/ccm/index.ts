import * as fs from 'fs-extra'
import * as path from 'path'
import * as hjson from 'hjson'

import { pack } from "./../../classes/pack";


export function ccm(packs: Array<pack>, compile_from: string, compile_to: string) {


    const lang_file_paths: Array<string> = [];
    for (let pack of packs) {
        for (let namespace of fs.readdirSync(path.join(pack.input_path, "data"))) {

            const json_exts: Array<string> = [".json", ".jsonc", ".hjson"]
            const lang_path = path.join(pack.input_path, "assets", namespace, "lang");
            if (fs.existsSync(lang_path)) for (let file of fs.readdirSync(lang_path)) {
                recurse_files(lang_path, file, json_exts, lang_file_paths);
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
            // I am the Google God, lmfao [LEAVE COMMENT] ~~entry.split(".")[entry.split(".").length - 1]~~
            arr.push(file_path);
        }
    }
    console.log(lang_file_paths);
}