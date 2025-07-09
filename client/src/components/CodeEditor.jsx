import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavigationBar from "./NavigationBar";
import "../css/CodeEditor.css";
import Editor from "@monaco-editor/react";

const API_URL = import.meta.env.VITE_API_URL;
const COMPILER_URL = import.meta.env.VITE_COMPILER_API_URL;

function CodeEditor() {
  const boilerplates = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);

    // Write your code here

    return 0;
}`,
    java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Write your code here
    }
}`,
    python: `def main():
    # Write your code here
    pass

main()`,
    c: `#include <stdio.h>

int main() {
    // Write your code here

    return 0;
}
`
  };

  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(boilerplates["cpp"]);
  const [output1, setOutput1] = useState("");
  const [output2, setOutput2] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [aiReview, setAiReview] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/problems/getProbById/${id}`
        );
        setProblem(res.data);
      } catch (err) {
        console.error(
          "Failed to load problem:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const getDifficultyColorClass = (level) => {
    switch ((level || "").toLowerCase()) {
      case "easy":
        return "bg-green-600 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAIReview = async () => {
    setActiveTab("ai");
    setAiLoading(true);
    setAiReview("");
    try {
      const res = await axios.post(import.meta.env.VITE_GOOGLE_GEMINI_API_URL, {
        code,
      });
      setAiReview(res.data.aiResponse);
    } catch (err) {
      console.error(err);
      setAiReview("❌ AI Review failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setIsSubmitting(false);
    setMode("run");
    setOutput1("");
    setOutput2("");
    setCustomOutput("");
    try {
      const [res1, res2] = await Promise.all([
        axios.post(`${COMPILER_URL}/api/compiler/run`, {
          language,
          code,
          input: problem.sampleInput1,
        }),
        axios.post(`${COMPILER_URL}/api/compiler/run`, {
          language,
          code,
          input: problem.sampleInput2,
        }),
      ]);
      setOutput1(res1.data.output);
      setOutput2(res2.data.output);
    } catch (error) {
      console.log(error);
      setOutput1(`Failed to run code!!: ${error.response.data.error}`);
      //   setOutput2("Failed to run code!!");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsRunning(false);
    setMode("submit");
    setOutput1("");
    setOutput2("");
    setCustomOutput("");
    try {
      const res = await axios.post(`${COMPILER_URL}/api/compiler/submit`, {
        language,
        code,
        problemId: id,
      });
      const verdict = res.data.verdict;
      setOutput1(verdict);
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(`${API_URL}/api/submissions/addSubmission`, {
        userId: user?._id,
        problemId: id,
        language,
        code,
        verdict,
        problemTitle: problem.title,
      });
    } catch(error) {
      console.log(error);
      setOutput1("Failed to submit code!!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomRun = async () => {
    setIsRunning(true);
    setIsSubmitting(false);
    setMode("custom");
    setOutput1("");
    setOutput2("");
    setCustomOutput("");
    try {
      const res = await axios.post(`${COMPILER_URL}/api/compiler/run`, {
        language,
        code,
        input: customInput,
      });
      console.log(res);
      setCustomOutput(res.data.output);
    } catch (error) {
      console.log(error.response.data.error);
      setCustomOutput(
        `❌ Failed to run with custom input: ${error.response.data.error}`
      );
    } finally {
      setIsRunning(false);
    }
  };

  if (loading || !problem) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading problem...</p>
      </div>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="editor-wrapper">
        <div className="tab-header">
          <button
            onClick={() => setActiveTab("description")}
            className={activeTab === "description" ? "active" : ""}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={activeTab === "submissions" ? "active" : ""}
          >
            Submissions
          </button>
          <button
            onClick={handleAIReview}
            className={activeTab === "ai" ? "active" : ""}
          >
            {aiLoading ? "Reviewing..." : "AI Review"}
          </button>
        </div>

        <div className="editor-content">
          <div className="left-panel">
            {activeTab === "description" && (
              <div className="problem-box">
                <h3>{problem.title}</h3>
                <div
                  className={`badge ${getDifficultyColorClass(
                    problem?.difficulty
                  )} dif`}
                >
                  {problem.difficulty}
                </div>
                <br />
                <strong>Description:</strong>
                <p>{problem.description}</p>
                <strong>Input Format:</strong>
                <p>{problem.inputFormat}</p>
                <strong>Output Format:</strong>
                <p>{problem.outputFormat}</p>
                <strong>Constraints:</strong>
                <pre>{problem.constraints}</pre>
                <strong>Sample Input 1:</strong>
                <pre>{problem.sampleInput1}</pre>
                <strong>Sample Output 1:</strong>
                <pre>{problem.sampleOutput1}</pre>
                <strong>Sample Input 2:</strong>
                <pre>{problem.sampleInput2}</pre>
                <strong>Sample Output 2:</strong>
                <pre>{problem.sampleOutput2}</pre>
              </div>
            )}
            {activeTab === "ai" && (
              <div className="ai-box">
                <h4>AI Review</h4>
                {aiLoading ? (
                  <div className="spinner" />
                ) : (
                  <pre>{aiReview || "Waiting for response..."}</pre>
                )}
              </div>
            )}
            {activeTab === "submissions" && (
              <div>
                <em>Submissions tab coming soon!</em>
              </div>
            )}
          </div>

          <div className="right-panel">
            <label className="">Language:</label>
            <select
              className="language-select"
              value={language}
              onChange={(e) => {
                const lang = e.target.value;
                setLanguage(lang);
                setCode(boilerplates[lang]);
              }}
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>

            <Editor
              height="500px"
              defaultLanguage="cpp"
              language={language}
              value={code}
              className="code-box"
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                glyphMargin: false,
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                wordWrap: "on",
                fontSize: 14,
                padding: {
                  top: 10,
                  bottom: 10,
                },
              }}
              onChange={(value) => setCode(value)}
            />

            <div className="button-group">
              <button onClick={handleRun} disabled={isRunning || isSubmitting}>
                ▶️ Run
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
              >
                🚀 Submit
              </button>
            </div>

            <label>Custom Input</label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="input-box"
              rows="4"
              placeholder="Enter custom input..."
            />
            <button
              onClick={handleCustomRun}
              disabled={isRunning}
              className="custom-run-btn"
            >
              🧪 Run Custom Test
            </button>

            {(isRunning ||
              isSubmitting ||
              output1 ||
              output2 ||
              customOutput) && (
              <div className="output-box">
                {(isRunning || isSubmitting) && <div className="spinner" />}
                <strong>Output:</strong>
                <pre>
                  {mode === "run" && `Output-1:\n${output1}\nOutput-2:\n${output2}`}
                  {mode === "submit" && output1}
                  {mode === "custom" && customOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CodeEditor;
