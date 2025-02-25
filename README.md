# QR Code Virtual Machine
## Installation
Python must be installed to execute the script. You can download it from the official website: https://www.python.org/downloads/.

Additionally, you need to install the required dependencies. Navigate to the `thesis` folder and run the following command:

```sh
pip install -r requirements.txt
```

## Modifying the QR Code Generation
The virtual machine (VM) executes a simple stack-based programme encoded as binary instructions. The programme is defined in the programmeme_text variable within the Python script.

Each instruction consists of an opcode and optional operands. The available instructions are:

```yaml
PUSH <value>       # Pushes a value onto the stack (16-bit integer)
POP                # Removes the top value from the stack
DUP                # Duplicates the top value on the stack
ADD, SUB, MUL, DIV # Performs arithmetic operations on the top two values
SET_COLOUR         # Sets a colour using three PUSH values (R, G, B)
DRAW_PIXEL         # Draws a pixel at the given coordinates (two PUSH values)
DRAW_LINE          # Draws a line using four PUSH values (x1, y1, x2, y2)
DRAW_RECT          # Draws a rectangle using four PUSH values (x, y, width, height)
HALT               # Stops execution
```

To modify the programme, edit the programmeme_text variable in `main.py` and add or change instructions as needed.

Example:

```python
programmeme_text = """
PUSH 255
PUSH 0
PUSH 0
SET_COLOUR
PUSH 5
PUSH 5
DRAW_PIXEL
HALT
"""
```

This programme sets the colour to red (255, 0, 0) and draws a pixel at (5,5).

## Running the Python QR Code Generation Script
Once you have installed the dependencies, run the script with:

```sh
python main.py
```

This will:
1. Convert the programme into a binary representation.
2. Encode the binary programme in a QR code.
3. Save the QR code as `code-generation/qr.png`.

## Running the VM
The VM is a TypeScript-based interpreter that executes the program encoded in the QR code. To run the VM, follow these steps:

1. **Navigate to the Virtual Machine Folder**\
Open a terminal and change into the `virtual-machine` directory:

```sh
cd virtual-machine
```

2. **Start the Development Server**\
Run the following command to start the VM in a local development environment:

```sh
npm run dev
```

This will launch a web server and make the VM accessible in your browser.

3. **Execute the Programme**
Scan the generated QR code using a QR scanner (e.g., https://scanqr.org/#scan).

The QR code contains a URL in the format:
```ruby
http://localhost:5173/?code=<binary_code>
```

Open this URL in your browser.

The pixel-based graphical output of the programme will be displayed.
