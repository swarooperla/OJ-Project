import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  inputFormat: {
    type: String,
    required: true,
  },
  outputFormat: {
    type: String,
    required: true,
  },
  constraints: {
    type: String,
    required: true,
  },
  sampleInput1: {
    type: String,
    required: true,
  },
  sampleOutput1: {
    type: String,
    required: true,
  },
  sampleInput2: {
    type: String,
    required: true,
  },
  sampleOutput2: {
    type: String,
    required: true,
  },
  hiddenTestcases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const ProblemModel = mongoose.model('Problem', problemSchema);
export default ProblemModel;
