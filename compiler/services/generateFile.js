import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const codesDir = path.join(__dirname, '..', 'codes');
if (!fs.existsSync(codesDir)) {
  fs.mkdirSync(codesDir, { recursive: true });
}

/**
 * Generates a code file for the given language and code.
 * For Java, always uses 'Main.java' due to class name requirements.
 */
const generateFile = (language, code) => {
  const jobId = uuidv4();
  let fileName, filePath;

  if (language === 'java') {
    // Save Java code as Main.java in a unique folder
    const javaDir = path.join(codesDir, jobId);
    if (!fs.existsSync(javaDir)) {
      fs.mkdirSync(javaDir, { recursive: true });
    }
    fileName = 'Main.java';
    filePath = path.join(javaDir, fileName);
  } else {
    fileName = `${jobId}.${language}`;
    filePath = path.join(codesDir, fileName);
  }

  fs.writeFileSync(filePath, code);
  return filePath;
};

export default generateFile;
