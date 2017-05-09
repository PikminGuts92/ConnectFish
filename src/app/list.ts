// Source: http://stackoverflow.com/questions/23096260/is-there-a-typescript-list-and-or-map-class-library

export class List<T> {
    private items: Array<T>;

    constructor() {
        this.items = [];
    }

    count(): number {
        return this.items.length;
    }

    add(value: T): void {
        this.items.push(value);
    }

    get(index: number): T {
        return this.items[index];
    }
}