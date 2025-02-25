export class FrameBuffer {
  width: number;
  height: number;
  buffer: string[][];

  constructor(width = 8, height = 4) {
    this.width = width;
    this.height = height;
    this.buffer = Array.from({ length: height }, () =>
      Array(width).fill("#000000")
    );
  }

  setPixel(x: number, y: number, colour: string) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      throw new Error("Pixel out of bounds");
    }
    this.buffer[y][x] = colour;
  }

  getPixel(x: number, y: number): string {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      throw new Error("Pixel out of bounds");
    }
    return this.buffer[y][x];
  }

  isEmpty(): boolean {
    return this.buffer.every((row) =>
      row.every((pixel) => pixel === "#000000")
    );
  }

  clear() {
    this.buffer = Array.from({ length: this.height }, () =>
      Array(this.width).fill("#000000")
    );
  }
}
