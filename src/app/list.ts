import { Hashable } from './hashable';

// Source: http://stackoverflow.com/questions/23096260/is-there-a-typescript-list-and-or-map-class-library

export class List<T> {
    private items: Array<T>;

    constructor() {
        this.items = [];
    }

    get count(): number {
        return this.items.length;
    }

    public add(value: T): void {
        this.items.push(value);
    }

    public get(index: number): T {
        return this.items[index];
    }

    public contains(value: T): boolean {
        if (this.isHashable(value)) {
            let valueHash = (value as any as Hashable).getHashCode();

            for (let item of this.items) {
                if ((item as any as Hashable).getHashCode() === valueHash) {
                    return true;
                }
                    
            }

            return false;
        }
        else {
            for (let item of this.items) {
                if (item === value)
                    return true;
            }

            return false;
        }
    }

    private isHashable(arg: any): boolean {
        return arg.getHashCode() !== undefined;
    }

    public toArray(): Array<T> {
        return this.items.slice(0);
    }

    public sort(method: any): void {
        let items2 = this.items.sort(method);
    } 
}