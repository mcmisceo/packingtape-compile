export class mpm_model {
    namespace: string;
    id: string;
    file: string;
    item: string;
    update: update;
}

class update {
    id: string;
    cmd: number;
}