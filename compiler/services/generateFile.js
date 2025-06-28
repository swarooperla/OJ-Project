import fs from 'fs'
import path from 'path'
import { v4 } from 'uuid'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const codes_dir = path.join(__dirname,'..', 'codes');
if(!fs.existsSync(codes_dir)){
    fs.mkdirSync(codes_dir, {recursive: true});
}
const generateFile = (language, code) => {
    const jobId = v4();
    const fileName = `${jobId}.${language}`;
    const filePath = path.join(codes_dir, fileName);
    fs.writeFileSync(filePath, code);
    return filePath;

}



export default generateFile
