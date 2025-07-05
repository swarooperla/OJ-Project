import executeCpp from "../services/executeCpp.js";
import generateFile from "../services/generateFile.js";
import generateInput from "../services/generateInput.js";
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const SERVER_API_URL = process.env.SERVER_API_URL;

export const executeRun = async (req, res) => {
  try {
    const { language, code, input } = req.body;

    if (!language || !code) {
      return res.status(400).json({ success: false, error: "Language or Code missing!" });
    }

    console.log("Executing run with:", { language });

    const inputPath = generateInput(input || "");
    const filePath = generateFile(language, code);

    const output = await executeCpp(filePath, inputPath);

    res.json({ filePath, output });

  } catch (error) {
    console.error("Run failed:", error);
    res.status(500).json({ output: "❌ Server error during execution", error: error.message });
  }
};


  export const executeSubmit = async (req, res) => {
    try {
      const { language, code, problemId } = req.body;

      if (!language || !code || !problemId) {
        return res.status(400).json({ verdict: "Missing language/code/problemId" });
      }
      console.log(code);

      const response = await axios.get(`${SERVER_API_URL}/api/problems/getProbById/${problemId}`);
      const problem = response.data;

      if (!problem?.hiddenTestcases?.length) {
        return res.status(404).json({ verdict: "No hidden test cases found for this problem" });
      }

      const filePath = generateFile(language, code);
      const normalize = str => str.trimEnd();
      const isDev = process.env.NODE_ENV !== 'production';

      let allPassed = true;
      let verdict = "Accepted";
      let failedCase = null;

      for (const test of problem.hiddenTestcases) {
        try {
          const inputPath = generateInput(test.input);
          const output = await executeCpp(filePath, inputPath);

          if (normalize(output) !== normalize(test.output)) {
            allPassed = false;
            verdict = "Wrong Answer";
            failedCase = {
              input: test.input,
              expected: test.output,
              received: output
            };
            break;
          }

        } catch (err) {
          allPassed = false;
          verdict = {
            compilation: "Compilation Error",
            runtime: "Runtime Error",
            timeout: "Time Limit Exceeded"
          }[err.type] || "Unknown Error";

          failedCase = {
            input: test.input,
            expected: test.output,
            received: err.stderr || err.message || "Error during execution"
          };

          break;
        }
      }

      const responsePayload = { verdict };
      if (isDev && failedCase) responsePayload.failedCase = failedCase;

      return res.status(200).json(responsePayload);

    } catch (error) {
      console.error("❌ Submit failed:", error);
      return res.status(500).json({ verdict: "❌ Server error during submission", error: error.message });
    }
  };
