import * as fs from "fs-extra"
import * as path from "path"

export function no_parse(copy_root: string, paste_root: string) {
    const namespaces: Array<string> = fs.readdirSync(path.join(copy_root, 'data'), "utf8");
    for (let namespace of namespaces) {
        if (namespace != "minecraft") {
            fs.copySync(path.join(copy_root, namespace), path.join(paste_root, namespace), {
                filter: (src) => path.extname(src) != '.mcfunction'
            });
        } else {
            try {
                fs.copySync(path.join(path.join(copy_root, 'minecraft'), 'tags'), path.join(path.join(paste_root, 'minecraft'), 'tags'));
            } catch (err) {
                console.log('No tags in minecraft namespace');
                console.error(err);
            }
        }
    }
}