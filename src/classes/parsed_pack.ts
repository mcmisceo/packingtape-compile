import { mpm_model } from './json_schema/mpm_model'

export class parsed_pack {
    description: string;
    data_format: number;
    assets_format: number;
    models: Array<mpm_model>;
}