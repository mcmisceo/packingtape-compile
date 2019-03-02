import { mpm_model } from './json_schema/mpm_model'
import { ccm_character } from './json_schema/ccm_character'

export class parsed_pack {
    description: string;
    data_format: number;
    assets_format: number;
    models: Array<mpm_model>;
    characters: Array<ccm_character>;
}