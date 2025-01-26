const OPCODE_TABLE: { [key: string]: string } = {
  PUSH: "00000001",
  POP: "00000010",
  DUP: "00000011",
  ADD: "00000100",
  SUB: "00000101",
  MUL: "00000110",
  DIV: "00000111",
  SET_COLOUR: "00001000",
  DRAW_PIXEL: "00001001",
  DRAW_LINE: "00001010",
  DRAW_RECT: "00001011",
  HALT: "00001100",
};

export class VirtualMachine {
  binaryCode: string;
  stack: number[];
  ip: number;
  frameBuffer: string[][];
  colour: string;

  constructor(binaryCode: string, width = 16, height = 16) {
    this.binaryCode = binaryCode;
    this.stack = [];
    this.ip = 0;
    this.frameBuffer = Array.from({ length: height }, () =>
      Array(width).fill("#000000")
    );
    this.colour = "#FFFFFF"; // Default white color
  }

  // Helper: Fetch next 8-bit opcode
  fetchByte(): string {
    const byte = this.binaryCode.slice(this.ip, this.ip + 8);
    this.ip += 8;
    return byte;
  }

  // Helper: Fetch and decode 16-bit operand
  fetchOperand(): number {
    const operand = this.binaryCode.slice(this.ip, this.ip + 16);
    this.ip += 16;
    return parseInt(operand, 2);
  }

  execute(): string[][] {
    while (this.ip < this.binaryCode.length) {
      const opcode = this.fetchByte();

      switch (opcode) {
        case OPCODE_TABLE["PUSH"]:
          const value = this.fetchOperand();
          this.stack.push(value);
          break;

        case OPCODE_TABLE["POP"]:
          this.stack.pop();
          break;

        case OPCODE_TABLE["DUP"]:
          if (this.stack.length > 0) {
            this.stack.push(this.stack[this.stack.length - 1]);
          }
          break;

        case OPCODE_TABLE["ADD"]:
          if (this.stack.length >= 2) {
            const b = this.stack.pop()!;
            const a = this.stack.pop()!;
            this.stack.push(a + b);
          }
          break;

        case OPCODE_TABLE["SUB"]:
          if (this.stack.length >= 2) {
            const b = this.stack.pop()!;
            const a = this.stack.pop()!;
            this.stack.push(a - b);
          }
          break;

        case OPCODE_TABLE["SET_COLOUR"]:
          const r = this.fetchOperand();
          console.log("r: ", r);
          const g = this.fetchOperand();
          console.log("g: ", g);
          const b = this.fetchOperand();
          console.log("b: ", b);
          this.colour = `rgb(${r}, ${g}, ${b})`;
          break;

        case OPCODE_TABLE["DRAW_PIXEL"]:
          const y = this.stack.pop()!;
          const x = this.stack.pop()!;
          if (
            x >= 0 &&
            y >= 0 &&
            x < this.frameBuffer[0].length &&
            y < this.frameBuffer.length
          ) {
            this.frameBuffer[y][x] = this.colour;
          }
          break;

        case OPCODE_TABLE["DRAW_LINE"]:
          const y2 = this.stack.pop()!;
          const x2 = this.stack.pop()!;
          const y1 = this.stack.pop()!;
          const x1 = this.stack.pop()!;
          if (x1 === x2) {
            for (let y = y1; y <= y2; y++) {
              this.frameBuffer[y][x1] = this.colour;
            }
          } else if (y1 === y2) {
            for (let x = x1; x <= x2; x++) {
              this.frameBuffer[y1][x] = this.colour;
            }
          }
          break;

        case OPCODE_TABLE["DRAW_RECT"]:
          const height = this.stack.pop()!;
          const width = this.stack.pop()!;
          const startY = this.stack.pop()!;
          const startX = this.stack.pop()!;
          for (let y = startY; y < startY + height; y++) {
            for (let x = startX; x < startX + width; x++) {
              if (
                x >= 0 &&
                y >= 0 &&
                x < this.frameBuffer[0].length &&
                y < this.frameBuffer.length
              ) {
                this.frameBuffer[y][x] = this.colour;
              }
            }
          }
          break;

        case OPCODE_TABLE["HALT"]:
          return this.frameBuffer;

        default:
          console.error("Unknown opcode:", opcode);
          return this.frameBuffer;
      }
    }

    return this.frameBuffer;
  }
}
