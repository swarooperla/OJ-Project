import executeCpp from "../services/executeCpp.js";
import generateFile from "../services/generateFile.js";
import generateInput from "../services/generateInput.js";


export const executeRun = async (req, res) => {
    try {
        const {language, code, input} = req.body;
        if(code === undefined){
            return res.status(404).json({success: false, error: "Empty Code!"});
        }
        const inputPath = generateInput(input);
        const filePath = generateFile(language, code);
        const output = await executeCpp(filePath, inputPath);
        res.json({filePath, output});


    } catch (error) {
        console.error("Run failed:", error);
        res.status(500).json({ output: "❌ Server error during execution" });   
    }
}

export const executeSubmit = async (req, res) => {
    try {
        const {language, code} = req.body;
        res.status(200).json({output: `Received submitted code from ${language}`});
    } catch (error) {
        console.error("Submit failed:", error);
        res.status(500).json({ output: "❌ Server error during execution" }); 
    }
}