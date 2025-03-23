import { useEffect, useState } from "react";
import { VirtualMachine } from "./utils/VirtualMachine";
import PixelGrid from "./PixelGrid";
import { FrameBuffer } from "./utils/FrameBuffer";

export default function App() {
  const [frameBuffer, setFrameBuffer] = useState<FrameBuffer>(
    new FrameBuffer()
  );

  useEffect(() => {
    const codeFromQuery = getQueryParam("code");
    if (codeFromQuery) {
      const vm = new VirtualMachine(codeFromQuery);
      const outputBuffer = vm.execute();
      setFrameBuffer(outputBuffer);
    }
  }, []);

  function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>QR-VM</h1>
      <PixelGrid frameBuffer={frameBuffer} />
    </div>
  );
}
