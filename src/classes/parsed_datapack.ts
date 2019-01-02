import { mpm_model } from './mpm_model'

export class parsed_datapack {
    description: string;
    data_format: number;
    assets_format: number;
    models: Array<mpm_model>;
}