import qrcode

opcode_table = {
    "PUSH": "00000001",  # 0x01
    "POP": "00000010",   # 0x02
    "DUP": "00000011",   # 0x03
    "ADD": "00000100",   # 0x04
    "SUB": "00000101",   # 0x05
    "MUL": "00000110",   # 0x06
    "DIV": "00000111",   # 0x07
    "SET_COLOUR": "00001000",  # 0x08 3x PUSH
    "DRAW_PIXEL": "00001001",  # 0x09 2x PUSH
    "DRAW_LINE": "00001010",   # 0x0A 4x PUSH
    "DRAW_RECT": "00001011",   # 0x0B 4x PUSH
    "HALT": "00001100",  # 0x0C
}

program_text = """
SET_COLOUR 255 0 0
DRAW_RECT 1 1 5 10
DRAW_RECT 1 6 5 2
DRAW_RECT 1 1 2 10
SET_COLOUR 0 255 0
DRAW_RECT 8 1 5 10
DRAW_RECT 8 5 5 2
DRAW_RECT 12 1 2 10
SET_COLOUR 0 0 255
DRAW_RECT 16 1 2 10
DRAW_RECT 18 2 2 8
DRAW_RECT 20 1 2 10
HALT
"""

def assemble_program(program_text, opcode_table):
    binary_code = []
    for line in program_text.strip().split("\n"):
        parts = line.split()
        mnemonic = parts[0]
        if mnemonic in opcode_table:
            binary_code.append(opcode_table[mnemonic])
            if len(parts) > 1:
                for operand in parts[1:]:
                    binary_code.append(format(int(operand), "016b"))
    return "".join(binary_code)

def generate_qr_code(binary_output):
    vm_url = f"http://localhost:5173/?code={binary_output}"
    qr = qrcode.QRCode(
        version=10,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(vm_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save("code-generation/qr.png")

if __name__ == "__main__":
    binary_output = assemble_program(program_text, opcode_table)
    print("binary:", binary_output)
    generate_qr_code(binary_output)
