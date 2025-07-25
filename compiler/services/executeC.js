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

const executeC = (filePath, inputPath) => {
  return new Promise((resolve, reject) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilePath = path.join(outputsDir, `${jobId}.txt`);
    const executablePath = path.join(outputsDir, `${jobId}.exe`);

    const compileCommand = `gcc "${filePath}" -o "${executablePath}"`;
    const runCommand = `"${executablePath}" < "${inputPath}" > "${outputFilePath}"`;

    exec(compileCommand, (compileErr, _, compileStderr) => {
      if (compileErr) {
        return reject({
          type: "compile",
          stderr: compileStderr,
          message: "Compilation Error",
        });
      }

      exec(runCommand, { timeout: 5000 }, (runErr, _, runStderr) => {
        const isTimeout = runErr && runErr.killed;
        if (isTimeout) {
          return reject({
            type: "timeout",
            stderr: "Time Limit Exceeded",
            message: "Time Limit Exceeded",
          });
        }

        if (runErr || runStderr) {
          return reject({
            type: "runtime",
            stderr: runStderr || runErr.message,
            message: "Runtime Error",
          });
        }

        // ✅ Read output from file
        fs.readFile(outputFilePath, "utf8", (err, data) => {
          if (err) {
            return reject({
              type: "file_read",
              stderr: err.message,
              message: "Failed to read output file",
            });
          }

          resolve({ stdout: data, outputFilePath });
        });
      });
    });
  });
};

export default executeC;
