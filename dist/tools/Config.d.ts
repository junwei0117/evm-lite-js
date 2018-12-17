export interface ConfigSchema {
    connection: {
        host: string;
        port: string;
    };
    defaults: {
        from: string;
        gas: number;
        gasPrice: number;
    };
    storage: {
        keystore: string;
    };
}
export default class Config {
    readonly directory: string;
    readonly name: string;
    data: any;
    readonly path: string;
    private initialData;
    constructor(directory: string, name: string);
    defaultTOML(): string;
    default(): ConfigSchema;
    toTOML(): string;
    load(): Promise<ConfigSchema>;
    save(): Promise<string>;
}
