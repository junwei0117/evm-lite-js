import * as JSONBig from 'json-bigint';

import BN from 'bn.js';

import AbstractClient from './AbstractClient';

export interface IBaseAccount {
	readonly address: string;
	readonly nonce: number;
	readonly balance: BN | number;
	readonly bytecode: string;
}

export interface ILog {
	readonly topics: string[];
	readonly address: string;
	readonly data: string;
	readonly blockNumber: string;
	readonly transactionHash: string;
	readonly transactionIndex: string;
	readonly blockHash: string;
	readonly logIndex: string;
	readonly removed: boolean;
	readonly event?: string;
	readonly args: any;
}

export interface IReceipt {
	readonly root: string;
	readonly transactionHash: string;
	readonly from: string;
	readonly to?: string;
	readonly gasUsed: number;
	readonly cumulativeGasUsed: number;
	readonly contractAddress: string;
	readonly logs: ILog[];
	readonly logsBloom: string;
	readonly status: number;
}

export interface ISendTxResponse {
	readonly txHash: string;
}

export interface IInput {
	readonly name: string;
	readonly type: string;
}

export interface IABI {
	readonly constant?: any;
	readonly inputs: IInput[];
	readonly name: string;
	readonly outputs?: any[];
	readonly payable: any;
	readonly stateMutability: any;
	readonly type: any;
}

export type IContractABI = IABI[];

interface ICallTxResponse {
	data: string;
}

export interface IPOAContract {
	readonly address: string;
	readonly abi: IContractABI;
}

class BaseEVMLC extends AbstractClient {
	constructor(host: string, port: number = 8080) {
		super(host, port);
	}

	public async getPOAContract(): Promise<IPOAContract> {
		const res = await this.get(`/poa`);

		try {
			return JSONBig.parse(res);
		} catch (e) {
			return Promise.reject(res);
		}
	}

	public async getReceipt(txHash: string): Promise<IReceipt> {
		const res = await this.get(`/tx/${txHash}`);

		try {
			return JSONBig.parse(res);
		} catch (e) {
			return Promise.reject(res);
		}
	}

	public async getAccount(address: string): Promise<IBaseAccount> {
		const response = await this.get(`/account/${address}`);
		const account = JSONBig.parse(response) as IBaseAccount;

		return account;
	}

	public async getInfo(): Promise<any> {
		const res = await this.get('/info');

		try {
			return JSONBig.parse(res);
		} catch (e) {
			return Promise.reject(res);
		}
	}

	// call tx
	public async callTx(tx: string): Promise<ICallTxResponse> {
		const res = await this.post('/call', tx);

		try {
			return JSONBig.parse(res);
		} catch (e) {
			return Promise.reject(res);
		}
	}

	// send tx
	public async sendTx(signedTx: string): Promise<IReceipt> {
		const res = await this.post('/rawtx', signedTx);

		try {
			return JSONBig.parse(res);
		} catch (e) {
			return Promise.reject(res);
		}
	}
}

export default BaseEVMLC;
