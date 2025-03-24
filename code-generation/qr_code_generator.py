import qrcode
from constants import OPCODE_TABLE

class QRCodeGenerator:
    def __init__(self):
        self.programme_text = self.read_programme_text()

    def read_programme_text(self):
        with open("code-generation/programme_text.txt") as f:
            return f.read()

    def assemble_program(self):
        hex_code = []

        for line in self.programme_text.strip().split("\n"):
            parts = line.split()
            mnemonic = parts[0]

            if mnemonic in OPCODE_TABLE:
                opcode = OPCODE_TABLE[mnemonic]
                
                if len(parts) > 1:
                    for operand in parts[1:]:
                        operand_value = int(operand)
                        hex_code.append(f"{opcode:01X}{operand_value:02X}")
                else:
                    hex_code.append(f"{opcode:01X}")

        hex_string = "".join(hex_code)

        return hex_string

    def generate_qr_code(self, base64_encoded):
        vm_url = f"http://localhost:5173/?code={base64_encoded}"
        # vm_url = f"https://qr-vm.netlify.app?code={base64_encoded}"
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