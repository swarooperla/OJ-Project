import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputs_dir = path.join(__dirname, "..", "outputs");
if (!fs.existsSync(outputs_dir)) {
  fs.mkdirSync(outputs_dir, { recursive: true });
}

const executeCpp = async (filePath, inputPath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outputFilePath = path.join(outputs_dir, jobId);

  return new Promise((resolve, reject) => {
    const compileCmd = `g++ ${filePath} -o ${outputFilePath}`;
    exec(compileCmd, (compErr, stdout, stderr) => {
      if (compErr) {
        return reject({
          type: "compilation",
          stderr,
          message: "Compilation Error",
        });
      }

      exec(
        `${outputFilePath} < ${inputPath}`,
        { timeout: 2000 },
        (runErr, stdout, stderr) => {
          const isTimeout = runErr && runErr.killed;
          if (runErr) {
            return reject({
              type: isTimeout ? "timeout" : "runtime",
              stderr,
              message: isTimeout ? "Time Limit Exceeded" : "Runtime Error",
            });
          }

          if (stderr) {
            return reject({
              type: "runtime",
              stderr,
              message: "Runtime Error (stderr)",
            });
          }

          return resolve(stdout);
        }
      );
    });
  });
};

export default executeCpp;
