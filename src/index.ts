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
    let new_manifest: manifest = manifest;

    if (check_manifest) if (fs.existsSync(manifest_path)) manifest = hjson.parse(manifest_path);
    last_packID = last_packID + manifest.lastID + 1;

    for (let packname of packnames) {
        let id: number;
        if (manifest) {
            let listed: number = 0;
            for (let pack in manifest.packs) {
                if (manifest.packs[pack].packname == packname) id = manifest.packs[pack].packid;
                else listed++;
            }
            if (listed == manifest.packs.length) {
                id = last_packID++;
                new_manifest.packs.push({
                    packid: id,
                    packname: packname,
                    objectives: undefined,
                    models: undefined
                })
            }
        } else id = last_packID++

        packs.push(new pack(path.join(compile_from, packname), id));
    }

    if (manifest) packs.sort((a, b) => { return a.id - b.id; });

    if (manifest) fs.writeFileSync(manifest_path, JSON.stringify(new_manifest));

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

compile("./test/compile_from", "./test/compile_to", undefined, true);