export const OPCODE_TABLE: { [key: string]: string } = {
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
