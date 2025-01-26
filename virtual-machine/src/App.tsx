import { useEffect, useState } from "react";
import { VirtualMachine } from "./utils/VirtualMachine";
import PixelGrid from "./PixelGrid";

export default function App() {
  const [frameBuffer, setFrameBuffer] = useState<string[][]>([]);

  useEffect(() => {
    const codeFromQuery = getQueryParam("code");
    console.log("codeFromQuery: ", codeFromQuery);
    if (codeFromQuery) {
      const vm = new VirtualMachine(codeFromQuery, 16, 16);
      const outputBuffer = vm.execute();
      setFrameBuffer(outputBuffer);
      console.log(outputBuffer);
    }
  }, []);

  function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  return (
    <div>
      <h1>Virtual Machine Frame Buffer</h1>
      {/* <PixelGrid frameBuffer={frameBuffer} /> */}
    </div>
  );
}
