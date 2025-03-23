import { FrameBuffer } from "./FrameBuffer";
import { Stack } from "./Stack";

const OPCODE_TABLE: { [key: string]: string } = {
  PUSH: "1",
  POP: "2",
  DUP: "3",
  ADD: "4",
  SUB: "5",
  MUL: "6",
  DIV: "7",
  SET_COLOUR: "8", // 3x PUSH
  DRAW_PIXEL: "9", // 2x PUSH
  DRAW_LINE: "A", // 4x PUSH
  DRAW_RECT: "B", // 4x PUSH
  JUMP: "C", // 1x PUSH
  JUMP_EQ: "D", // 2x PUSH
  JUMP_NE: "E", // 2x PUSH
  HALT: "F",
};

export class VirtualMachine {
  hexCode: string;
  stack: Stack;
  instructionPointer: number;
  frameBuffer: FrameBuffer;
  colour: string;

  constructor(hexCode: string) {
    this.hexCode = hexCode;
    this.stack = new Stack();
    this.instructionPointer = 0;
    this.frameBuffer = new FrameBuffer(5, 5);
    this.colour = "//FFFFFF"; // Default white color
  }

  fetchByte(): string {
    const opcodeSize = 1;
    const byte = this.hexCode.slice(
      this.instructionPointer,
      this.instructionPointer + opcodeSize
    );
    this.instructionPointer += opcodeSize;
    return byte;
  }

  fetchOperand(): number {
    const operandSize = 2;
    const operand = this.hexCode.slice(
      this.instructionPointer,
      this.instructionPointer + operandSize
    );
    this.instructionPointer += operandSize;
    return parseInt(operand, 16);
  }

  execute(): FrameBuffer {
    while (this.instructionPointer < this.hexCode.length) {
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
          const b = this.stack.pop()!;
          const g = this.stack.pop()!;
          const r = this.stack.pop()!;
          this.colour = `rgb(${r}, ${g}, ${b})`;
          break;

        case OPCODE_TABLE["DRAW_PIXEL"]:
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
          return this.frameBuffer;

        default:
          console.error("Unknown opcode:", opcode);
          return this.frameBuffer;
      }
    }

    return this.frameBuffer;
  }
}
