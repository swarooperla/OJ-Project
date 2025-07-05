import Submission from '../models/submission.js';

export const getUserSubmissions = async (req, res) => {
  const { userId } = req.query;
  console.log(userId);
  try {
    const submissions = await Submission.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error });
  }
};


export const addSubmission = async (req, res) => {
  const { userId, problemId, code, language, verdict, problemTitle } = req.body;
  if(!userId || !problemId || !code || !language || !verdict || !problemTitle){
    return res.status(400).json({
      message: 'Missing required field',
      required: ['userId', 'problemId', 'code', 'language', 'verdict', 'problemTitle'],
      received: req.body,
    });
  }
  try {
    const submission = new Submission({
      userId,
      problemId,
      code,
      language,
      verdict,
      problemTitle,
    });
    await submission.save();
    res.status(201).json({message: 'Succesfully saved submission', submission});
  } catch (error) {
    console.log("❌ Error saving submission:", error);
    res.status(500).json({ message: 'Error saving submission', error });
  }
};
