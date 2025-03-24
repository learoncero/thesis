OPCODE_TABLE = {
    "PUSH": 0x1,
    "POP": 0x2,
    "DUP": 0x3,
    "ADD": 0x4,
    "SUB": 0x5,
    "MUL": 0x6,
    "DIV": 0x7,
    "SET_COLOUR": 0x8,  # 3x PUSH
    "DRAW_PIXEL": 0x9,  # 2x PUSH
    "DRAW_LINE": 0xA,   # 4x PUSH
    "DRAW_RECT": 0xB,   # 4x PUSH
    "JUMP": 0xC,       # 1x PUSH
    "JUMP_EQ": 0xD,    # 2x PUSH
    "JUMP_NE": 0xE,    # 2x PUSH
    "HALT": 0xF,
}