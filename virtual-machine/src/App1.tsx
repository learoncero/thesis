import { useEffect, useState } from "react";
import "./App.css";
import { VirtualMachine } from "./utils/VirtualMachine";

function App() {
  const [binaryInput, setBinaryInput] = useState<string>(""); // Input binary code
  const [stackOutput, setStackOutput] = useState<number[]>([]); // Stack output

  useEffect(() => {
    // Fetch binary code from query parameter and execute
    const codeFromQuery = getQueryParam("code");
    if (codeFromQuery) {
      setBinaryInput(codeFromQuery);
      const vm = new VirtualMachine(codeFromQuery);
      const output = vm.execute();
      setStackOutput([1]);
    }
  }, []);

  function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function handleExecute() {
    const vm = new VirtualMachine(binaryInput);
    const output = vm.execute();
    setStackOutput([1]);
  }

  function handleOpenNewTab() {
    const newTab = window.open("", "_blank");
    if (newTab) {
      newTab.document.write(
        `<h1>Stack Output</h1><pre>${JSON.stringify(
          stackOutput,
          null,
          2
        )}</pre>`
      );
      newTab.document.close();
    }
  }

  return (
    <div className="App">
      <h1>Virtual Machine Simulator</h1>
      <textarea
        value={binaryInput}
        onChange={(e) => setBinaryInput(e.target.value)}
        placeholder="Enter binary code here..."
        rows={10}
        cols={50}
      />
      <div>
        <button onClick={handleExecute}>Execute</button>
        <button onClick={handleOpenNewTab} disabled={stackOutput.length === 0}>
          Open in New Tab
        </button>
      </div>
      <h2>Stack Output</h2>
      <pre>{JSON.stringify(stackOutput, null, 2)}</pre>
    </div>
  );
}

export default App;
