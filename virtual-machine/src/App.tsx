import { useEffect, useState } from "react";
import { VirtualMachine } from "./utils/VirtualMachine";
import PixelGrid from "./PixelGrid";
import { FrameBuffer } from "./utils/FrameBuffer";
import "./App.css";

export default function App() {
  const [frameBuffer, setFrameBuffer] = useState<FrameBuffer>(
    new FrameBuffer()
  );
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const codeFromQuery = getQueryParam("code");
    if (codeFromQuery) {
      const vm = new VirtualMachine(codeFromQuery);
      const output = vm.execute();

      if (output instanceof FrameBuffer && !output.isEmpty()) {
        setFrameBuffer(output);
      } else if (typeof output === "number") {
        setResult(output);
      }
    }
  }, []);

  function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  return (
    <div className="app-container">
      <h1>QR-VM</h1>
      <h2>A Virtual Machine and Assembly Language for Quick Response Codes</h2>

      {frameBuffer && !frameBuffer.isEmpty() ? (
        <PixelGrid frameBuffer={frameBuffer} />
      ) : (
        result !== null && (
          <p className="computation-result">
            <span>Computation Result:</span> {result}
          </p>
        )
      )}
    </div>
  );
}
