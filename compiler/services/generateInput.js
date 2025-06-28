import fs from 'fs'
import path from 'path'
import { v4 } from 'uuid'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input_dir = path.join(__dirname, '..', "inputs");
if(!fs.existsSync(input_dir)){
    fs.mkdirSync(input_dir, {recursive: true});
}


const generateInput = (input) => {
    const jobId = v4();
    const inputFileName = `${jobId}.txt`;
    const inputFilePath = path.join(input_dir, inputFileName);
    fs.writeFileSync(inputFilePath, input);
    return inputFilePath;
}
export default generateInput