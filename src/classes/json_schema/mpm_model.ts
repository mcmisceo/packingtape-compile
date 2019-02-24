export class mpm_model {
    namespace: string;
    id: string;
    file: string;
    item: string;
    old: old = undefined;
}

class old {
    id: string;
    cmd: number;
}