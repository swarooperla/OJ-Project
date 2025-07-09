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

    const executePython = async (filePath, inputPath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilePath = path.join(outputs_dir, `${jobId}.txt`);

    return new Promise((resolve, reject) => {
        const command = `python "${filePath}" < "${inputPath}"`;

        exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
        const isTimeout = error && error.killed;

        if (isTimeout) {
            return reject({
            type: "timeout",
            stderr: "Time Limit Exceeded",
            message: "Execution timed out",
            outputFilePath,
            });
        }

        if (error) {
            return reject({
            type: "runtime",
            stderr,
            message: "Runtime Error",
            outputFilePath,
            });
        }

        if (stderr) {
            return reject({
            type: "runtime",
            stderr,
            message: "Runtime Error (stderr)",
            outputFilePath,
            });
        }

        resolve({ stdout, outputFilePath });
        });
    });
    };

    export default executePython;
