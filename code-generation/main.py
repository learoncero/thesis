from utils.qr_code_generator import QRCodeGenerator

if __name__ == "__main__":
    qr_code_generator = QRCodeGenerator()
    hex_output = qr_code_generator.assemble_programme()
    print("Hex Output:", hex_output)
    qr_code_generator.generate_qr_code(hex_output)
