import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavigationBar from "./NavigationBar";
import "../css/codeEditor.css";
import Editor from "@monaco-editor/react";

const API_URL = import.meta.env.VITE_API_URL;
const COMPILER_URL = import.meta.env.VITE_COMPILER_API_URL;

function CodeEditor() {
  const boilerplates = {
    cpp: `#include <bits/stdc++.h>
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
`,
  };

  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || "guest";
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
  const [selectedCode, setSelectedCode] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [showLoginSubmitMessage, setShowLoginSubmitMessage] = useState(false);
  const [showLoginSubmissionsMessage, setShowLoginSubmissionsMessage] = useState(false);
  const [showLoginAIReviewMessage, setShowLoginAIReviewMessage] = useState(false);

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

    const fetchSubmissions = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id || !id) return;

      try {
        const res = await axios.get(`${API_URL}/api/submissions`, {
          params: { userId: user._id, problemId: id },
        });
        setSubmissions(res.data || []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };

    fetchProblem();
    fetchSubmissions();
  }, [id]);

  useEffect(() => {
    const saved = localStorage.getItem(`code_${userId}_${id}_${language}`);
    setCode(saved || boilerplates[language]);
    
  }, [id, language, userId]);

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

  // Utility to clean markdown formatting from AI review
  const cleanAIText = (text) => {
    if (!text) return "";
    return text
      .replace(/```[a-zA-Z]*\n?/g, "") // Remove ``` and language after ```
      .replace(/```/g, "")              // Remove any remaining ```
      .replace(/\*\*/g, "")           // Remove **
      .replace(/__+/g, "")              // Remove __
      .replace(/\n{3,}/g, "\n\n")    // Replace 3+ newlines with 2
      .trim();
  };

  const cleanErrorOutput = (text) => {
    if (!text) return "";
    // Remove any file path ending with .cpp/.c/.java/.py and the colon, anywhere in the line
    return text
      .split('\n')
      .map(line =>
        line.replace(/([A-Za-z]:)?[^\s:]+\.(cpp|c|java|python):/g, "")
      )
      .join('\n')
      .replace(/^[ \t]+/gm, "") // Remove leading whitespace
      .replace(/\n{3,}/g, "\n\n") // Collapse 3+ newlines
      .trim();
  };

  const handleAIReview = async () => {
    if (!localStorage.getItem("token")) {
      setShowLoginAIReviewMessage(true);
      return;
    }
    setActiveTab("ai");
    setAiLoading(true);
    setAiReview("");
    try {
      const res = await axios.post(import.meta.env.VITE_GOOGLE_GEMINI_API_URL, {
        code,
      });
      setAiReview(cleanAIText(res.data.aiResponse));
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
      setOutput1(`${error.response.data.errorMsg}: \n ${error.response.data.error}`);
      //   setOutput2("Failed to run code!!");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!localStorage.getItem("token")) {
      setShowLoginSubmitMessage(true);
      return;
    }
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
      console.log(res.data);
      const verdict = res.data.verdict;
      const errorInCode = res.data.errorInCode;
      setOutput1(verdict);
      if (errorInCode) {
        setOutput1(`${errorInCode.errorMsg}: \n ${errorInCode.errorData}`);
      }
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(`${API_URL}/api/submissions/addSubmission`, {
        userId: user?._id,
        problemId: id,
        language,
        code,
        verdict,
        problemTitle: problem.title,
      });
      const refreshed = await axios.get(`${API_URL}/api/submissions`, {
        params: { userId: user._id, problemId: id },
      });
      setSubmissions(refreshed.data || []);
    } catch (error) {
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

  const handleOpenModal = (code) => {
    setSelectedCode(code);
  };

  const handleCloseModal = () => {
    setSelectedCode(null);
  };

  return (
    <>
      <NavigationBar />
      {showLoginMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: '32px 24px',
            minWidth: '300px',
            maxWidth: '90vw',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.1rem', marginBottom: 24, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
              Login to see your submissions
            </div>
            <button className="button" onClick={() => setShowLoginMessage(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      {showLoginSubmitMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: '32px 24px',
            minWidth: '300px',
            maxWidth: '90vw',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.1rem', marginBottom: 24, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
              Login to submit the code
            </div>
            <button className="button" onClick={() => setShowLoginSubmitMessage(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      {showLoginSubmissionsMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: '32px 24px',
            minWidth: '300px',
            maxWidth: '90vw',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.1rem', marginBottom: 24, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
              Login to see your submissions
            </div>
            <button className="button" onClick={() => setShowLoginSubmissionsMessage(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      {showLoginAIReviewMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: '32px 24px',
            minWidth: '300px',
            maxWidth: '90vw',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.1rem', marginBottom: 24, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
              Login to see AI Review of your code
            </div>
            <button className="button" onClick={() => setShowLoginAIReviewMessage(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      <div className="editor-wrapper">
        <div className="tab-header">
          <button
            onClick={() => setActiveTab("description")}
            className={activeTab === "description" ? "active" : ""}
          >
            Description
          </button>
          <button
            onClick={() => {
              if (!localStorage.getItem("token")) {
                setShowLoginSubmissionsMessage(true);
                return;
              }
              setActiveTab("submissions");
            }}
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
                {problem.tags && problem.tags.length > 0 && (
                  <div className="problem-tags-row" style={{margin: '8px 0 12px 0', display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                    {problem.tags.map((tag, i) => (
                      <span key={i} className="badge badge-muted problem-list-tag-badge">{tag}</span>
                    ))}
                  </div>
                )}
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
              <div className="ai-box ai-review-vertical">
                <h4>AI Review</h4>
                {aiLoading ? (
                  <div className="ai-review-text">AI is checking....</div>
                ) : (
                  <pre className="ai-review-text">{aiReview || "Waiting for response..."}</pre>
                )}
              </div>
            )}
            {activeTab === "submissions" && !localStorage.getItem("token") ? (
              <div className="submissions-box">
                <h4>Submissions</h4>
                <div style={{ color: 'var(--color-error)', fontWeight: 600, margin: '24px 0' }}>
                  Login to see your submissions
                </div>
              </div>
            ) : activeTab === "submissions" && (
              <div className="submissions-box">
                <h4>Submissions</h4>
                {loading ? (
                  <p>Loading...</p>
                ) : submissions.length === 0 ? (
                  <p>No submissions yet.</p>
                ) : (
                  <ul className="submission-list">
                    {submissions.map((sub, idx) => (
                      <li key={sub._id} className="submission-row">
                        <span>{idx + 1}.</span>
                        <span
                          className={`verdict ${sub.verdict.toLowerCase()}`}
                        >
                          {sub.verdict}
                        </span>
                        <span>{sub.language.toUpperCase()}</span>
                        <button onClick={() => handleOpenModal(sub.code)}>
                          View Code
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Code Modal */}
                {selectedCode && (
                  <div className="code-modal">
                    <div className="modal-content">
                      <button className="close-btn" onClick={handleCloseModal}>
                        ×
                      </button>
                      <pre>{selectedCode}</pre>
                    </div>
                  </div>
                )}
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
              onChange={(value) => {
                setCode(value);
                localStorage.setItem(`code_${userId}_${id}_${language}`, value);
              }}
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
                <strong>Output:</strong>
                {isRunning || isSubmitting ? (
                  <p>Executing...</p>
                ) : (
                  <>
                    {mode === "run" && (
                      <>
                        {output1 && <pre className="output-text">{cleanErrorOutput(output1)}</pre>}
                        {output2 && <pre className="output-text">{cleanErrorOutput(output2)}</pre>}
                      </>
                    )}
                    {mode === "submit" && (
                      <pre className="output-text">{cleanErrorOutput(output1)}</pre>
                    )}
                    {mode === "custom" && (
                      <pre className="output-text">{cleanErrorOutput(customOutput)}</pre>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CodeEditor;
