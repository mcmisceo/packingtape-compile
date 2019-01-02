import * as fs from "fs-extra"
import * as path from "path"
import { pack } from "./classes/pack"
import * as setup_output from "./build/setup_output/index"
import { json_clean } from "./build/json_clean/index"
import { mpm } from "./build/mpm/index"
import { score_ns } from "./build/score_ns/index"
import { tag_ns } from "./build/tag_ns/index"
import { lootmerge } from "./build/lootmerge/index"
import { no_parse } from "./build/no_parse/index";


export function compile(compile_from: string, compile_to: string, in_dev: boolean) {
    let packs: Array<pack> = [];
    let packID: number = 0;
    const packnames: Array<string> = fs.readdirSync(compile_from, "utf8");
    let assets_formats: Array<number> = [];

    for (let packname of packnames) packs.push(new pack(path.join(compile_from, packname), packID++));


    for (let dp of packs) {
        const path_from: string = path.join(compile_from, dp.name);
        const path_to: string = path.join(compile_to, dp.name);

        no_parse(path_from, path_to);
        setup_output.datapack(dp, compile_to);
        json_clean();
        score_ns();
        tag_ns();
        assets_formats.push(dp.asset_format);
    }

    mpm(packs);
    lootmerge();

    setup_output.resources(compile_to, Math.max(...assets_formats));
}

compile("./test/compile_from", "./test/compile_to", true); // aight lets try it