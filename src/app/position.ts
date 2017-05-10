import { Hashable } from './hashable';

export class Position implements Hashable {
    constructor(public row: number, public column: number) { }

    public getHashCode(): number {
        const prime = 23;
        let hash = 59; // Also a prime

        hash *= prime + this.row;
        hash *= prime + this.column;
        return hash;
    }
}