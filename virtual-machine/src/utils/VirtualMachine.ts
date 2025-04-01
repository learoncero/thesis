import { OPCODE_TABLE } from "./constants";
import { FrameBuffer } from "./FrameBuffer";
import { Stack } from "./Stack";

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
    this.frameBuffer = new FrameBuffer();
    this.colour = "//FFFFFF"; // Default white color
  }

  fetchOpcode(): string {
    if (this.instructionPointer >= this.hexCode.length) {
      throw new Error("Unexpected end of bytecode while fetching opcode.");
    }

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

    if (this.instructionPointer + operandSize > this.hexCode.length) {
      throw new Error("Unexpected end of bytecode while fetching operand.");
    }

    const operand = this.hexCode.slice(
      this.instructionPointer,
      this.instructionPointer + operandSize
    );
    this.instructionPointer += operandSize;
    return parseInt(operand, 16);
  }

  execute(): FrameBuffer | number {
    try {
      while (this.instructionPointer < this.hexCode.length) {
        const opcode = this.fetchOpcode();

        switch (opcode) {
          case OPCODE_TABLE["PUSH"]:
            const value = this.fetchOperand();
            this.stack.push(value);
            break;

          case OPCODE_TABLE["POP"]:
            if (this.stack.length === 0) {
              throw new Error("Stack underflow on POP.");
            }

            this.stack.pop();
            break;

          case OPCODE_TABLE["DUP"]:
            if (this.stack.length > 0) {
              this.stack.push(this.stack.get(this.stack.length - 1));
            } else {
              throw new Error("Stack underflow on DUP.");
            }
            break;

          case OPCODE_TABLE["ADD"]:
            if (this.stack.length >= 2) {
              const b = this.stack.pop()!;
              const a = this.stack.pop()!;
              this.stack.push(a + b);
            } else {
              throw new Error("Stack underflow on ADD.");
            }
            break;

          case OPCODE_TABLE["SUB"]:
            if (this.stack.length >= 2) {
              const b = this.stack.pop()!;
              const a = this.stack.pop()!;
              this.stack.push(a - b);
            } else {
              throw new Error("Stack underflow on SUB.");
            }
            break;

          case OPCODE_TABLE["MUL"]:
            if (this.stack.length >= 2) {
              const b = this.stack.pop()!;
              const a = this.stack.pop()!;
              this.stack.push(a * b);
            } else {
              throw new Error("Stack underflow on MUL.");
            }
            break;

          case OPCODE_TABLE["DIV"]:
            if (this.stack.length >= 2) {
              const b = this.stack.pop()!;
              const a = this.stack.pop()!;
              this.stack.push(a / b);
            } else {
              throw new Error("Stack underflow on DIV.");
            }
            break;

          case OPCODE_TABLE["SET_COLOUR"]:
            if (this.stack.length >= 3) {
              const b = this.stack.pop()!;
              const g = this.stack.pop()!;
              const r = this.stack.pop()!;
              this.colour = `rgb(${r}, ${g}, ${b})`;
            } else {
              throw new Error("Stack underflow on SET_COLOUR.");
            }
            break;

          case OPCODE_TABLE["DRAW_PIXEL"]:
            if (this.stack.length >= 2) {
              const y = this.stack.pop()!;
              const x = this.stack.pop()!;
              this.frameBuffer.setPixel(x, y, this.colour);
            } else {
              throw new Error("Stack underflow on DRAW_PIXEL.");
            }
            break;

          case OPCODE_TABLE["DRAW_LINE"]:
            if (this.stack.length >= 4) {
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
            } else {
              throw new Error("Stack underflow on DRAW_LINE.");
            }
            break;

          case OPCODE_TABLE["DRAW_RECT"]:
            if (this.stack.length >= 4) {
              const height = this.stack.pop()!;
              const width = this.stack.pop()!;
              const startY = this.stack.pop()!;
              const startX = this.stack.pop()!;
              for (let y = startY; y < startY + height; y++) {
                for (let x = startX; x < startX + width; x++) {
                  this.frameBuffer.setPixel(x, y, this.colour);
                }
              }
            } else {
              throw new Error("Stack underflow on DRAW_RECT.");
            }
            break;

          case OPCODE_TABLE["JUMP"]:
            if (this.stack.length < 1) {
              throw new Error("Stack underflow on JUMP.");
            }

            const jumpOffset = this.stack.pop()!;
            if (
              this.instructionPointer + jumpOffset >= this.hexCode.length ||
              this.instructionPointer + jumpOffset < 0
            ) {
              throw new Error("Invalid jump destination.");
            }

            this.instructionPointer += jumpOffset;
            break;

          case OPCODE_TABLE["JUMP_EQ"]:
            if (this.stack.length < 3) {
              throw new Error("Stack underflow on JUMP_EQ.");
            }
            const jumpAddressEQ = this.stack.pop()!;
            if (
              this.instructionPointer + jumpAddressEQ >= this.hexCode.length ||
              this.instructionPointer + jumpAddressEQ < 0
            ) {
              throw new Error("Invalid conditional jump destination.");
            }
            const valueEQ1 = this.stack.pop()!;
            const valueEQ2 = this.stack.pop()!;
            if (valueEQ1 === valueEQ2) {
              this.instructionPointer += jumpAddressEQ;
            }
            break;

          case OPCODE_TABLE["JUMP_NE"]:
            if (this.stack.length < 3) {
              throw new Error("Stack underflow on JUMP_NE.");
            }

            const jumpAddressNE = this.stack.pop()!;
            if (
              this.instructionPointer + jumpAddressNE >= this.hexCode.length ||
              this.instructionPointer + jumpAddressNE < 0
            ) {
              throw new Error("Invalid conditional jump destination.");
            }

            const valueNE1 = this.stack.pop()!;
            const valueNE2 = this.stack.pop()!;
            if (valueNE1 !== valueNE2) {
              this.instructionPointer += jumpAddressNE;
            }
            break;

          case OPCODE_TABLE["HALT"]:
            if (this.frameBuffer.isEmpty() && this.stack.length > 0) {
              return this.stack.pop()!;
            } else {
              return this.frameBuffer;
            }

          default:
            throw new Error(`Unknown opcode: ${opcode}`);
        }
      }
    } catch (error) {
      console.error("Execution error:", error);
      return this.frameBuffer;
    }

    if (this.frameBuffer.isEmpty() && this.stack.length > 0) {
      return this.stack.pop()!;
    } else {
      return this.frameBuffer;
    }
  }
}
