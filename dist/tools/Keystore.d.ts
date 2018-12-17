import { BaseAccount, EVMLC } from "..";
export default class Keystore {
    readonly directory: string;
    readonly name: string;
    readonly path: string;
    constructor(directory: string, name: string);
    create(password: string, output?: string): Promise<string>;
    import(data: string): Promise<string>;
    update(address: string, old: string, newPass: string): Promise<void>;
    all(fetch?: boolean, connection?: EVMLC): Promise<any[]>;
    get(address: string): Promise<string>;
    getFilePathForAddress(address: string): string;
    fetch(address: string, connection: EVMLC): Promise<BaseAccount>;
    private allKeystoreFiles;
    private getKeystoreFile;
}
