import * as fs from "fs-extra"
import * as path from "path"
import * as hjson from "hjson"

import * as setup_output from "./build/setup_output/index"
import * as no_parse from "./build/no_parse/index";
import { pack } from "./classes/pack"
import { json_clean } from "./build/json_clean/index"
import { mpm } from "./build/mpm/index"
import { score_ns } from "./build/score_ns/index"
import { tag_ns } from "./build/tag_ns/index"
import { lootmerge } from "./build/lootmerge/index"
import { manifest } from "./classes/json_schema/manifest"


export function compile(compile_from: string, compile_to: string, manifest_path: string = undefined, in_dev: boolean = null) {
    let check_manifest: boolean = false;
    if (typeof manifest_path !== undefined) check_manifest = true;
    if (typeof in_dev === undefined) in_dev = false;
    let packs: Array<pack> = [];
    let last_packID: number = 0;
    const packnames: Array<string> = fs.readdirSync(compile_from, "utf8");
    let assets_formats: Array<number> = [];
    let manifest: manifest = undefined;

    //if (check_manifest) if (fs.existsSync(manifest_path)) manifest = hjson.parse(manifest_path);
    //last_packID = last_packID + manifest.lastID + 1;

    for (let packname of packnames) packs.push(new pack(path.join(compile_from, packname), last_packID++));


    //if(manifest) fs.writeFileSync(manifest_path, JSON.stringify());



    for (let pack of packs) assets_formats.push(pack.asset_format);
    setup_output.resources(compile_to, Math.max(...assets_formats));

    for (let pack of packs) {
        const path_from: string = path.join(compile_from, pack.name);
        pack.output_path = path.join(compile_to, 'datapacks', pack.name);

        setup_output.datapack(pack);
        no_parse.data(path_from, pack.output_path);

        no_parse.assets(path_from, compile_to);

        score_ns();
        tag_ns();
    }

    mpm(packs);
    lootmerge(packs);
    json_clean(compile_to);
}

compile("./test/compile_from", "./test/compile_to", undefined, true); // aight lets try it