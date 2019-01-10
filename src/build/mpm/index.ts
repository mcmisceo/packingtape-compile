import * as fs from 'fs-extra'
import * as path from 'path'
import { pack } from './../../classes/pack'
import { mpm_model } from './../../classes/json_schema/mpm_model'
import { model } from './../../classes/json_schema/minecraft/model'

export function mpm(packs: Array<pack>) {
    let pack_ids: object = {};
    for (let pack of packs) {
        const packid: string = pack.id.toString();
        const pack_id = { [packid]: pack.name };
        pack_ids = { ...pack_ids, ...pack_id }
    }

}
