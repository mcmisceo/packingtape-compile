"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var hjson = require("hjson");
var pack = /** @class */ (function () {
    function pack(dp_path, id) {
        this.name = path.basename(dp_path);
        this.path = dp_path;
        this.id = id;
        var data;
        try {
            data = fs.readFileSync(path.join(dp_path, 'datapack.jsonc'), 'utf-8');
        }
        catch (err) {
            console.log(err);
            throw 'Invalid Datapack (Missing datapack.jsonc)';
        }
        var datapackjs = hjson.parse(data);
        this.description = datapackjs['description'];
        this.data_format = datapackjs['data-format'];
        this.asset_format = datapackjs['assets-format'];
        this.models = datapackjs['models'];
    }
    return pack;
}());
exports.pack = pack;
//# sourceMappingURL=pack.js.map