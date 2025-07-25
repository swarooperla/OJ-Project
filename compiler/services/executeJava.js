import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputsDir = path.join(__dirname, "..", "outputs");
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

const executeJava = async (filePath, inputPath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const dir = path.dirname(filePath);
  const outputFilePath = path.join(outputsDir, `${jobId}.txt`);

  return new Promise((resolve, reject) => {
    const compileCmd = `javac "${filePath}"`;
    const runCmd = `java -cp "${dir}" Main < "${inputPath}"`;

    exec(compileCmd, (compileError, _, compileStderr) => {
      if (compileError || compileStderr) {
        return reject({
          type: "Compilation Error",
          stderr: compileStderr || compileError.message,
          message: "Compilation Error",
          outputFilePath,
        });
      }

      exec(runCmd, { timeout: 5000 }, (runError, stdout, runStderr) => {
        const isTimeout = runError && runError.killed;

        if (isTimeout) {
          return reject({
            type: "timeout",
            stderr: "Time Limit Exceeded",
            message: "Time Limit Exceeded",
            outputFilePath,
          });
        }

        if (runError || runStderr) {
          return reject({
            type: "runtime",
            stderr: runStderr || runError.message,
            message: "Runtime Error",
            outputFilePath,
          });
        }

        resolve({ stdout, outputFilePath });
      });
    });
  });
};

export default executeJava;
