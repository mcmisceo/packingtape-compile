import { mpm_model } from './mpm_model'

export class manifest {
    packs: Array<old_pack>;
    lastID: number;
}

class old_pack {
    packname: string;
    packid: number;
    objectives: Array<String>;
    models: mpm_model;
}