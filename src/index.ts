import * as fs from "fs"
import * as path from "path"
import { pack } from "./classes/pack"
import { json_clean } from "./build/json_clean/index"
import { mpm } from "./build/mpm/index"
import { score_ns } from "./build/score_ns/index"
import { tag_ns } from "./build/tag_ns/index"
import { lootmerge } from "./build/lootmerge/index"


export function compile(compile_from: string, compile_to: string, in_dev: boolean) {
    let packs: Array<pack> = [];
    let packID: number = 0;
    fs.readdir(compile_from, (err, packnames) => {
        if (err) console.log(err);
        if (err) throw "Invalid Path";
        for (let packname of packnames) packs.push(new pack(path.join(compile_from, packname), packID++));


        json_clean();
        mpm()
        score_ns();
        tag_ns();
        lootmerge();
    });

}

compile("./test/pre-comp", "../test/output", true);