declare module 'evm-lite-lib' {
    export {default as EVMLC} from 'evm-lite-lib/evm/EVMLC';
    export {default as Account} from 'evm-lite-lib/evm/classes/Account';
    export {default as Keystore} from 'evm-lite-lib/tools/classes/Keystore';
    export {default as Config, ConfigSchema} from 'evm-lite-lib/tools/classes/Config';
    export {BaseAccount} from 'evm-lite-lib/evm/client/AccountClient';
    export {SentTX, SignedTransaction, default as Transaction} from 'evm-lite-lib/evm/classes/Transaction';
    export * from 'evm-lite-lib/evm/utils/Interfaces';
    export {V3JSONKeyStore} from 'web3-eth-accounts';
    export {default as DataDirectory} from 'evm-lite-lib/tools/DataDirectory';
    export {default as Static} from 'evm-lite-lib/tools/classes/Static';
    export {TXReceipt} from "evm-lite-lib/evm/client/TransactionClient";
}

declare module 'evm-lite-lib/evm/EVMLC' {
    import {ABI} from "evm-lite-lib/evm/utils/Interfaces";
    import Transaction, {BaseTX} from "evm-lite-lib/evm/classes/Transaction";
    import SolidityContract from "evm-lite-lib/evm/classes/SolidityContract";
    import DefaultClient from "evm-lite-lib/evm/client/DefaultClient";

    interface UserDefinedDefaultTXOptions extends BaseTX {
        from: string;
    }

    export default class EVMLC extends DefaultClient {
        readonly defaultOptions: UserDefinedDefaultTXOptions;
        defaultFrom: string;
        defaultGas: number;
        defaultGasPrice: number;

        constructor(host: string, port: number, userDefaultTXOptions: UserDefinedDefaultTXOptions);

        generateContractFromABI(abi: ABI[]): SolidityContract;

        prepareTransfer(to: string, value: number, from?: string): Promise<Transaction>;
    }
    export {};
}

declare module 'evm-lite-lib/evm/classes/Account' {
    import {Account as Web3Account, V3JSONKeyStore} from 'web3-eth-accounts';
    import {BaseAccount} from "evm-lite-lib/";
    import Transaction, {SignedTransaction, TX} from 'evm-lite-lib/evm/classes/Transaction';
    export default class Account {
        readonly address: string;
        readonly privateKey: string;
        balance: number;
        nonce: number;

        constructor(data?: Web3Account);

        static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string): Account;

        sign(message: string): any;

        signTransaction(tx: TX | Transaction): Promise<SignedTransaction>;

        encrypt(password: string): V3JSONKeyStore;

        toBaseAccount(): BaseAccount;
    }
}

declare module 'evm-lite-lib/tools/classes/Keystore' {
    import {V3JSONKeyStore} from 'web3-eth-accounts';
    import {BaseAccount, EVMLC} from "evm-lite-lib/";
    export default class Keystore {
        readonly directory: string;
        readonly name: string;
        readonly path: string;

        constructor(directory: string, name: string);

        create(password: string, output?: string): Promise<string>;

        import(data: string): Promise<string>;

        update(address: string, old: string, newPass: string): Promise<string>;

        list(fetch?: boolean, connection?: EVMLC): Promise<BaseAccount[]>;

        get(address: string): Promise<V3JSONKeyStore>;
    }
}

declare module 'evm-lite-lib/tools/classes/Config' {
    export interface ConfigSchema {
        connection: {
            host: string;
            port: number;
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
        readonly path: string;
        data: ConfigSchema;

        constructor(directory: string, name: string);

        defaultTOML(): string;

        default(): ConfigSchema;

        toTOML(): string;

        load(): Promise<ConfigSchema>;

        save(data: ConfigSchema): Promise<string>;
    }
}

declare module 'evm-lite-lib/evm/client/AccountClient' {
    import {Nonce} from "evm-lite-lib/evm/types";
    import BaseClient from "evm-lite-lib/evm/client/BaseClient";

    export interface BaseAccount {
        address: string;
        nonce: Nonce;
        balance: any;
    }

    export default class AccountClient extends BaseClient {
        constructor(host: string, port: number);

        getAccount(address: string): Promise<Readonly<BaseAccount>>;

        getAccounts(): Promise<Readonly<BaseAccount[]>>;
    }
}

declare module 'evm-lite-lib/evm/classes/Transaction' {
    import {Address, ChainID, Data, Gas, GasPrice, Nonce, Value} from "evm-lite-lib/evm/types";
    import TransactionClient, {TXReceipt} from "evm-lite-lib/evm/client/TransactionClient";
    import Account from "evm-lite-lib/evm/classes/Account";

    export interface SentTX {
        from: string;
        to: string;
        value: number;
        gas: number;
        nonce: number;
        gasPrice: number;
        date: any;
        txHash: string;
    }

    export interface BaseTX {
        gas: Gas;
        gasPrice: GasPrice;
        nonce?: Nonce;
        chainId?: ChainID;
    }

    export interface TX extends BaseTX {
        from: Address;
        to?: Address;
        value?: Value;
        data?: Data;
    }

    interface OverrideTXOptions {
        to?: string;
        from?: string;
        value?: number;
        gas?: number;
        gasPrice?: number;
    }

    export interface SignedTransaction {
        messageHash: string;
        v: string;
        r: string;
        s: string;
        rawTransaction: string;
    }

    export default class Transaction extends TransactionClient {
        tx: TX;
        receipt?: TXReceipt;

        constructor(tx: TX, host: string, port: number, constant: boolean, unpackfn?: ((data: string) => any) | undefined);

        send(options?: OverrideTXOptions): Promise<TXReceipt>;

        sign(account: Account): Promise<SignedTransaction>;

        call(options?: OverrideTXOptions): Promise<string>;

        toString(): string;

        from(from: string): this;

        to(to: string): this;

        value(value: number): this;

        gas(gas: number): this;

        gasPrice(gasPrice: number): this;

        data(data: string): this;
    }
    export {};
}

declare module 'evm-lite-lib/evm/utils/Interfaces' {
    export interface Input {
        name: string;
        type: string;
    }

    export interface ABI {
        constant?: any;
        inputs: Input[];
        name?: any;
        outputs?: any[];
        payable: any;
        stateMutability: any;
        type: any;
    }
}

declare module 'evm-lite-lib/tools/DataDirectory' {
    import Config from "evm-lite-lib/tools/classes/Config";
    import Keystore from "evm-lite-lib/tools/classes/Keystore";
    export default class DataDirectory {
        readonly path: string;
        readonly config: Config;
        readonly keystore: Keystore;

        constructor(path: string);
    }
}

declare module 'evm-lite-lib/tools/classes/Static' {
    export default class Static {
        static exists(path: string): boolean;

        static isDirectory(path: string): boolean;

        static createDirectoryIfNotExists(path: string): void;

        static createOrReadFile(path: string, data: string): string;

        static isEquivalentObjects(objectA: any, objectB: any): boolean;
    }
}

declare module 'evm-lite-lib/evm/client/TransactionClient' {
    import BaseClient from "evm-lite-lib/evm/client/BaseClient";

    export interface TXReceipt {
        root: string;
        transactionHash: string;
        from: string;
        to?: string;
        gasUsed: number;
        cumulativeGasUsed: number;
        contractAddress: string;
        logs: [];
        logsBloom: string;
        status: number;
    }

    interface SentRawTXResponse {
        txHash: string;
    }

    export default class TransactionClient extends BaseClient {
        constructor(host: string, port: number);

        callTX(tx: string): Promise<Readonly<string>>;

        sendTX(tx: string): Promise<Readonly<string>>;

        sendRaw(tx: string): Promise<Readonly<SentRawTXResponse>>;

        getReceipt(txHash: string): Promise<Readonly<TXReceipt>>;
    }
    export {};
}

declare module 'evm-lite-lib/evm/classes/SolidityContract' {
    import {ABI, TXReceipt} from "evm-lite-lib/";
    import {Address, Data, Gas, GasPrice} from "evm-lite-lib/evm/types";
    import Transaction from "evm-lite-lib/evm/classes/Transaction";

    export interface ContractOptions {
        gas: Gas;
        gasPrice: GasPrice;
        from: Address;
        address?: Address;
        data?: Data;
        jsonInterface: ABI[];
    }

    export default class SolidityContract {
        options: ContractOptions;
        methods: {
            [key: string]: () => Transaction;
        };
        web3Contract: any;
        receipt?: TXReceipt;

        constructor(options: ContractOptions, host: string, port: number);

        deploy(options?: {
            parameters?: any[];
            gas?: number;
            gasPrice?: any;
            data?: string;
        }): Promise<this>;

        setAddressAndPopulate(address: string): this;

        address(address: string): this;

        gas(gas: number): this;

        gasPrice(gasPrice: number): this;

        data(data: string): this;

        JSONInterface(abis: ABI[]): this;
    }
}

declare module 'evm-lite-lib/evm/client/DefaultClient' {
    import AccountClient from "evm-lite-lib/evm/client/AccountClient";
    export default abstract class DefaultClient extends AccountClient {
        protected constructor(host: string, port: number);

        testConnection(): Promise<boolean>;

        getInfo(): Promise<Readonly<object>>;
    }
}

declare module 'evm-lite-lib/' {
    export {default as EVMLC} from 'evm-lite-lib/evm/EVMLC';
    export {default as Account} from 'evm-lite-lib/evm/classes/Account';
    export {default as Keystore} from 'evm-lite-lib/tools/classes/Keystore';
    export {default as Config, ConfigSchema} from 'evm-lite-lib/tools/classes/Config';
    export {BaseAccount} from 'evm-lite-lib/evm/client/AccountClient';
    export {SentTX, SignedTransaction, default as Transaction} from 'evm-lite-lib/evm/classes/Transaction';
    export * from 'evm-lite-lib/evm/utils/Interfaces';
    export {V3JSONKeyStore} from 'web3-eth-accounts';
    export {default as DataDirectory} from 'evm-lite-lib/tools/DataDirectory';
    export {default as Static} from 'evm-lite-lib/tools/classes/Static';
    export {TXReceipt} from "evm-lite-lib/evm/client/TransactionClient";
}

declare module 'evm-lite-lib/evm/types' {
    import AddressType from 'evm-lite-lib/evm/types/types/AddressType';
    import ArrayType from 'evm-lite-lib/evm/types/types/ArrayType';
    import BooleanType from 'evm-lite-lib/evm/types/types/BooleanType';
    import ByteType from 'evm-lite-lib/evm/types/types/ByteType';
    import EVMType from 'evm-lite-lib/evm/types/types/EVMType';
    import StringType from 'evm-lite-lib/evm/types/types/StringType';
    import {TX} from "evm-lite-lib/evm/classes/Transaction";
    export {AddressType, ArrayType, BooleanType, ByteType, StringType, EVMType};
    export * from 'evm-lite-lib/evm/types/types/TransactionTypes';

    export function parseSolidityTypes(raw: string): AddressType | BooleanType | ByteType | StringType | ArrayType<ByteType> | undefined;

    export function parseTransaction(tx: TX): {
        from: string;
        to: string | undefined;
        value?: number | undefined;
        data?: string | undefined;
        gas: number;
        gasPrice: number;
        nonce?: number | undefined;
        chainId?: number | undefined;
    };
}

declare module 'evm-lite-lib/evm/client/BaseClient' {
    export const request: (options: any, tx?: string | undefined) => Promise<string>;
    export default abstract class BaseClient {
        readonly host: Readonly<string>;
        readonly port: Readonly<number>;

        protected constructor(host: Readonly<string>, port: Readonly<number>);

        protected options(method: string, path: string): {
            host: string;
            port: number;
            method: string;
            path: string;
        };
    }
}

declare module 'evm-lite-lib/evm/types/types/AddressType' {
    import EVMType from "evm-lite-lib/evm/types/types/EVMType";
    export default class AddressType extends EVMType {
        readonly value: string;

        constructor(value: string);
    }
}

declare module 'evm-lite-lib/evm/types/types/ArrayType' {
    import EVMType from "evm-lite-lib/evm/types/types/EVMType";
    export default class ArrayType<T extends EVMType> extends EVMType {
        readonly item: T;
        readonly size?: number | undefined;

        constructor(item: T, size?: number | undefined);
    }
}

declare module 'evm-lite-lib/evm/types/types/BooleanType' {
    import EVMType from "evm-lite-lib/evm/types/types/EVMType";
    export default class BooleanType extends EVMType {
        constructor();
    }
}

declare module 'evm-lite-lib/evm/types/types/ByteType' {
    import EVMType from "evm-lite-lib/evm/types/types/EVMType";
    export default class ByteType extends EVMType {
        readonly size: number;

        constructor();
    }
}

declare module 'evm-lite-lib/evm/types/types/EVMType' {
    export default abstract class EVMType {
        protected constructor();
    }
}

declare module 'evm-lite-lib/evm/types/types/StringType' {
    import EVMType from "evm-lite-lib/evm/types/types/EVMType";
    export default class StringType extends EVMType {
        constructor();
    }
}

declare module 'evm-lite-lib/evm/types/types/TransactionTypes' {
    import AddressType from "evm-lite-lib/evm/types/types/AddressType";
    export type Gas = number;
    export type GasPrice = number;
    export type Value = number;
    export type Nonce = number;
    export type ChainID = number;
    export type Address = AddressType;
    export type Data = string;
}

