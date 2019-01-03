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


export function compile(compile_from: string, compile_to: string, manifest: string, in_dev: boolean) {
    let packs: Array<pack> = [];
    let packID: number = 0;
    const packnames: Array<string> = fs.readdirSync(compile_from, "utf8");
    let assets_formats: Array<number> = [];

    if (fs.existsSync(manifest)) packID = packID + hjson.parse(manifest).lastID + 1;

    for (let packname of packnames) packs.push(new pack(path.join(compile_from, packname), packID++));

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

compile("./test/compile_from", "./test/compile_to", "./test/compile_to/manifest.json", true); // aight lets try it