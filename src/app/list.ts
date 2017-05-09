import { Hashable } from './hashable';

// Source: http://stackoverflow.com/questions/23096260/is-there-a-typescript-list-and-or-map-class-library

class Hash { }

export class List<T> {
    private items: Array<T>;

    constructor() {
        this.items = [];
    }

    public count(): number {
        return this.items.length;
    }

    public add(value: T): void {
        this.items.push(value);
    }

    public get(index: number): T {
        return this.items[index];
    }

    public contains(value: T): boolean {

        for (let item of this.items) {
            //if (item instanceof Hashable) break;
        }

        return false;
    }
}