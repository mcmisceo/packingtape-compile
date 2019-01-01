"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var pack_1 = require("./classes/pack");
var index_1 = require("./build/json_clean/index");
var index_2 = require("./build/mpm/index");
var index_3 = require("./build/score_ns/index");
var index_4 = require("./build/tag_ns/index");
var index_5 = require("./build/lootmerge/index");
function compile(compile_from, compile_to, in_dev) {
    var packs = [];
    var packID = 0;
    fs.readdir(compile_from, function (err, packnames) {
        if (err)
            console.log(err);
        if (err)
            throw "Invalid Path";
        for (var _i = 0, packnames_1 = packnames; _i < packnames_1.length; _i++) {
            var packname = packnames_1[_i];
            packs.push(new pack_1.pack(path.join(compile_from, packname), packID++));
        }
        index_1.json_clean();
        index_2.mpm();
        index_3.score_ns();
        index_4.tag_ns();
        index_5.lootmerge();
    });
}
exports.compile = compile;
compile("./test/pre-comp", "../test/output", true);
//# sourceMappingURL=index.js.map