import executeCpp from "../services/executeCpp.js";
import generateFile from "../services/generateFile.js";
import generateInput from "../services/generateInput.js";
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_URL = process.env.API_URL;

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
      return res.status(400).json({ output: "Missing language/code/problemId" });
    }

    const response = await axios.get(`${API_URL}/api/problems/getProbById/${problemId}`);
    const problem = response.data;

    if (!problem?.hiddenTestcases?.length) {
      return res.status(404).json({ output: "No hidden test cases found for this problem" });
    }

    const filePath = generateFile(language, code);
    let allPassed = true;
    let failedCase = null;

    const normalize = str => str.replace(/\s+$/, '');
    const isDev = process.env.NODE_ENV !== 'production';

    for (const test of problem.hiddenTestcases) {
      try {
        const inputPath = generateInput(test.input);
        const output = await executeCpp(filePath, inputPath);
        if (normalize(output) !== normalize(test.output)) {
          allPassed = false;
          failedCase = { input: test.input, expected: test.output, received: output };
          break;
        }
      } catch (err) {
        allPassed = false;
        failedCase = { input: test.input, expected: test.output, received: "Runtime/Compile Error" };
        break;
      }
    }

    if (allPassed) {
      return res.status(200).json({ output: "✅ All hidden test cases passed!" });
    } else {
      return res.status(200).json({
        output: isDev
          ? `❌ Test case failed!\nInput: ${failedCase.input}\nExpected: ${failedCase.expected}\nReceived: ${failedCase.received}`
          : "❌ Some hidden test case failed. Please try again."
      });
    }
  } catch (error) {
    console.error("Submit failed:", error);
    res.status(500).json({ output: "❌ Server error during execution" });
  }
};
