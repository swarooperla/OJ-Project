import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../css/Compiler.css";

const COMPILER_URL = import.meta.env.VITE_COMPILER_API_URL;

const boilerplates = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`,
  python: `def main():\n    # Write your code here\n    pass\n\nmain()`,
  c: `#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}`,
};

const Compiler = () => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(boilerplates["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("");
    try {
      const res = await axios.post(`${COMPILER_URL}/api/compiler/run`, {
        language,
        code,
        input,
      });
      setOutput(res.data.output);
    } catch (error) {
      setOutput(
        error.response?.data?.error || "Failed to run code. Please try again."
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="compiler-page">
        <div className="compiler-left">
          <div className="compiler-controls">
            <select
              className="compiler-language-select"
              value={language}
              onChange={e => {
                setLanguage(e.target.value);
                setCode(boilerplates[e.target.value]);
              }}
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
            <button
              className="compiler-run-btn"
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Run"}
            </button>
          </div>
          <Editor
            height="500px"
            defaultLanguage={language}
            language={language}
            value={code}
            className="compiler-editor"
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              glyphMargin: false,
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              wordWrap: "on",
              fontSize: 14,
              padding: { top: 10, bottom: 10 },
            }}
            onChange={value => setCode(value)}
          />
        </div>
        <div className="compiler-right">
          <label className="compiler-label">Input</label>
          <textarea
            className="compiler-input-box"
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={8}
            placeholder="Enter input here..."
          />
          <label className="compiler-label" style={{marginTop: '24px'}}>Output</label>
          <div className="compiler-output-box">
            {isRunning ? <span>Running...</span> : <pre>{output}</pre>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Compiler;