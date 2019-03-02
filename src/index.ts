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
import { old_pack } from "./classes/old_pack";


export function compile(compile_from: string, compile_to: string, manifest_path: string = undefined, in_dev: boolean = null) {
    let check_manifest: boolean = false;
    if (manifest_path) check_manifest = true;
    if (!in_dev) in_dev = false;
    let packs: Array<pack> = [];
    let last_packID: number = 0;
    const packnames: Array<string> = fs.readdirSync(compile_from, "utf8");
    let assets_formats: Array<number> = [];
    let manifest: manifest = undefined;

    if (check_manifest) if (fs.existsSync(manifest_path)) manifest = JSON.parse(manifest_path);
    let new_manifest: manifest;
    if (manifest) new_manifest = Object.assign({}, manifest);


    if (manifest) last_packID = manifest.lastID + 1;

    for (let packname of packnames) { // sort packs & push them
        let id: number;
        let old_pack: old_pack = undefined;
        if (manifest) {
            let found: boolean = false;
            for (let pack of manifest.packs) {
                if (pack.packname == packname) {
                    id = pack.packid;
                    old_pack = pack;
                    found = true
                }
            }
            if (!found) {
                id = last_packID++;
                new_manifest.packs.push({
                    packid: id,
                    packname: packname,
                    objectives: undefined,
                    models: undefined
                })
            }
        } else id = last_packID++;

        packs.push(new pack(path.join(compile_from, packname), id, old_pack));
    }

    if (manifest) {
        packs.sort((a, b) => { return a.id - b.id; });
        fs.writeFileSync(manifest_path, JSON.stringify(new_manifest));
    }

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

    mpm(packs, compile_to, compile_from, manifest_path);
    lootmerge(packs);
    json_clean(compile_to);
}

compile("./test/compile_from", "./test/compile_to", undefined, true);