import executeCpp from "../services/executeCpp.js";
import generateFile from "../services/generateFile.js";
import generateInput from "../services/generateInput.js";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs/promises";

dotenv.config();

const SERVER_API_URL = process.env.SERVER_API_URL;

import path from "path";
import executePython from "../services/executePython.js";
import executeJava from "../services/executeJava.js";
import executeC from "../services/executeC.js";

export const cleanupFiles = async (paths) => {
  for (const filePath of paths) {
    if (!filePath) continue;
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      //    console.log(`Deleted: ${filePath}`);
    } catch (err) {
      if (err.code === "ENOENT") {
        console.warn(`File not found (already deleted?): ${filePath}`);
      } else {
        console.warn(`Failed to delete ${filePath}:`, err.message);
      }
    }
  }
};

export const executeRun = async (req, res) => {
  let filePath;
  let inputPath;
  let outputFilePath;

  try {
    const { language, code, input } = req.body;

    if (!language || !code) {
      return res
        .status(400)
        .json({ success: false, error: "Language or Code missing!" });
    }

    inputPath = generateInput(input || "");
    filePath = generateFile(language, code);

    let result;

    switch (language) {
      case "cpp":
        result = await executeCpp(filePath, inputPath);
        break;
      case "c":
        result = await executeC(filePath, inputPath);
        break;
      case "python":
        result = await executePython(filePath, inputPath);
        break;
      case "java":
        result = await executeJava(filePath, inputPath);
        break;
      default:
        return res
          .status(400)
          .json({ success: false, error: "Unsupported language!" });
    }
    console.log(result);
    let output = result.stdout;
    if (!output) {
      output = "Please enter some code";
    }
    outputFilePath = result.outputFilePath;

    res.json({ filePath, output });
  } catch (error) {
    if (error.outputFilePath) {
      outputFilePath = error.outputFilePath;
    }
    await cleanupFiles([filePath, inputPath, outputFilePath]);
  console.log(error);
    res.status(500).json({
      output: "❌ Server error during execution",
      error: error.message,
    });
  } finally {
    if (filePath && inputPath && outputFilePath) {
      await cleanupFiles([filePath, inputPath, outputFilePath]);
    }
  }
};

export const executeSubmit = async (req, res) => {
  let filePath;
  let inputPath;
  let outputFilePath;
  try {
    const { language, code, problemId } = req.body;

    if (!language || !code || !problemId) {
      return res
        .status(400)
        .json({ verdict: "Missing language/code/problemId" });
    }

    const response = await axios.get(
      `${SERVER_API_URL}/api/problems/getProbById/${problemId}`
    );
    const problem = response.data;

    if (!problem?.hiddenTestcases?.length) {
      return res
        .status(404)
        .json({ verdict: "No hidden test cases found for this problem" });
    }

    filePath = generateFile(language, code);
    const normalize = (str) => str.trimEnd();
    const isDev = process.env.NODE_ENV !== "production";

    let allPassed = true;
    let verdict = "Accepted";
    let failedCase = null;
    const tempFiles = [];

    for (const test of problem.hiddenTestcases) {
      try {
        inputPath = generateInput(test.input);
        tempFiles.push(inputPath);

        let result;

        switch (language) {
          case "cpp":
            result = await executeCpp(filePath, inputPath);
            break;
          case "c":
            result = await executeC(filePath, inputPath);
            break;
          case "python":
            result = await executePython(filePath, inputPath);
            break;
          case "java":
            result = await executeJava(filePath, inputPath);
            break;
          default:
            return res.status(400).json({ verdict: "Unsupported language!" });
        }

        const output = result.stdout;
        outputFilePath = result.outputFilePath;
        if (outputFilePath) tempFiles.push(outputFilePath);

        if (normalize(output) !== normalize(test.output)) {
          allPassed = false;
          verdict = "Wrong Answer";
          failedCase = {
            input: test.input,
            expected: test.output,
            received: output,
          };
          break;
        }
      } catch (err) {
        await cleanupFiles([filePath, inputPath, outputFilePath]);
        allPassed = false;
        verdict =
          {
            compilation: "Compilation Error",
            runtime: "Runtime Error",
            timeout: "Time Limit Exceeded",
          }[err.type] || "Unknown Error";

        failedCase = {
          input: test.input,
          expected: test.output,
          received: err.stderr || err.message || "Error during execution",
        };

        break;
      }
    }

    tempFiles.push(filePath); // code file
    await cleanupFiles(tempFiles); // ✅ Cleanup all temp files

    const responsePayload = { verdict };
    if (isDev && failedCase) responsePayload.failedCase = failedCase;

    return res.status(200).json(responsePayload);
  } catch (error) {
    await cleanupFiles([filePath, inputPath, outputFilePath]);
    console.error("❌ Submit failed:", error);
    return res.status(500).json({
      verdict: "❌ Server error during submission",
      error: error.message,
    });
  }
};
