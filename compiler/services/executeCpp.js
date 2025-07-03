import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputs_dir = path.join(__dirname, '..', 'outputs');
if (!fs.existsSync(outputs_dir)) {
  fs.mkdirSync(outputs_dir, { recursive: true });
}

const executeCpp = async (filePath, inputPath) => {
  const jobId = path.basename(filePath).split('.')[0];
  const outputFilePath = path.join(outputs_dir, jobId); // ❌ remove .exe

  return new Promise((resolve, reject) => {
    const command = `g++ ${filePath} -o ${outputFilePath} && ${outputFilePath} < ${inputPath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject({ error, stderr });
      }
      if (stderr) {
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
};

export default executeCpp;
