import { FrameBuffer } from "./FrameBuffer";
import { Stack } from "./Stack";

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
  stack: Stack;
  instructionPointer: number;
  frameBuffer: FrameBuffer;
  colour: string;

  constructor(binaryCode: string) {
    this.binaryCode = binaryCode;
    this.stack = new Stack();
    this.instructionPointer = 0;
    this.frameBuffer = new FrameBuffer(5, 5);
    this.colour = "#FFFFFF"; // Default white color
  }

  // Helper: Fetch next 8-bit opcode
  fetchByte(): string {
    const opcodeSize = 8;
    const byte = this.binaryCode.slice(
      this.instructionPointer,
      this.instructionPointer + opcodeSize
    );
    this.instructionPointer += opcodeSize;
    return byte;
  }

  // Helper: Fetch and decode 16-bit operand
  fetchOperand(): number {
    const operandSize = 16;
    const operand = this.binaryCode.slice(
      this.instructionPointer,
      this.instructionPointer + operandSize
    );
    this.instructionPointer += operandSize;
    return parseInt(operand, 2);
  }

  execute(): FrameBuffer {
    while (this.instructionPointer < this.binaryCode.length) {
      console.log("ip: ", this.instructionPointer);
      console.log("stack: ", this.stack);
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
            this.stack.push(this.stack.get(this.stack.length - 1));
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

        case OPCODE_TABLE["MUL"]:
          if (this.stack.length >= 2) {
            const b = this.stack.pop()!;
            const a = this.stack.pop()!;
            this.stack.push(a * b);
          }
          break;

        case OPCODE_TABLE["DIV"]:
          if (this.stack.length >= 2) {
            const b = this.stack.pop()!;
            const a = this.stack.pop()!;
            this.stack.push(a / b);
          }
          break;

        case OPCODE_TABLE["SET_COLOUR"]:
          console.log("SET_COLOUR");
          const b = this.stack.pop()!;
          const g = this.stack.pop()!;
          const r = this.stack.pop()!;
          this.colour = `rgb(${r}, ${g}, ${b})`;
          break;

        case OPCODE_TABLE["DRAW_PIXEL"]:
          console.log("DRAW_PIXEL");
          const y = this.stack.pop()!;
          const x = this.stack.pop()!;
          this.frameBuffer.setPixel(x, y, this.colour);
          break;

        case OPCODE_TABLE["DRAW_LINE"]:
          const y2 = this.stack.pop()!;
          const x2 = this.stack.pop()!;
          const y1 = this.stack.pop()!;
          const x1 = this.stack.pop()!;
          if (x1 === x2) {
            for (let y = y1; y <= y2; y++) {
              this.frameBuffer.setPixel(x1, y, this.colour);
            }
          } else if (y1 === y2) {
            for (let x = x1; x <= x2; x++) {
              this.frameBuffer.setPixel(x, y1, this.colour);
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
              this.frameBuffer.setPixel(x, y, this.colour);
            }
          }
          break;

        case OPCODE_TABLE["HALT"]:
          console.log("HALT");
          return this.frameBuffer;

        default:
          console.error("Unknown opcode:", opcode);
          return this.frameBuffer;
      }
    }

    return this.frameBuffer;
  }
}
