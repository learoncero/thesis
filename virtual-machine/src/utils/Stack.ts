// https://github.com/Seanld/vm

export class Stack {
  items: number[];

  constructor() {
    this.items = [];
  }

  push(item: number) {
    this.items.push(item);
  }

  pop(): number | undefined {
    return this.items.pop();
  }

  get length() {
    return this.items.length;
  }

  get(index: number) {
    return this.items[index];
  }
}
