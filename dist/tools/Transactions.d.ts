import { SentTX } from "../evm/classes/Transaction";
export default class Transactions {
    private dbPath;
    private transactions;
    constructor(dbPath: string, transactions: SentTX[]);
    all(): SentTX[];
    add(tx: any): void;
    get(hash: string): SentTX;
    sort(): void;
}
