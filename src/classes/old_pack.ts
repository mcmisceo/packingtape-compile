import { mpm_model } from './json_schema/mpm_model'

export class old_pack {
    packname: string;
    packid: number;
    objectives: Array<String>;
    models: Array<mpm_model>;
}