import Problem from '../models/problem.js';

export const controlCreateProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    inputFormat,
    outputFormat,
    constraints,
    sampleInput1,
    sampleOutput1,
    sampleInput2,
    sampleOutput2,
    hiddenTestcases,
    tags = []
  } = req.body;

  // Basic field validation
  if (
    !title || !description || !inputFormat || !outputFormat ||
    !constraints || !sampleInput1 || !sampleOutput1 || !sampleInput2 || !sampleOutput2 || !difficulty
  ) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  try {
    const newProblem = await Problem.create({
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      sampleInput1,
      sampleOutput1,
      sampleInput2,
      sampleOutput2,
      difficulty,
      hiddenTestcases: hiddenTestcases || [],
      tags: tags || []
    });

    res.status(200).json({
      message: 'Problem Created Successfully',
      problem: newProblem
    });
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ message: "Server error while creating problem" });
  }
};

export const getprobs = async (req, res) => {
  try {
    const problems = await Problem.find();
    const problemObj = problems.map(problem => {
      const problemObj = problem.toObject();
      delete problemObj.hiddenTestcases;
      return problemObj;
    });
    res.status(200).json(problemObj);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: "Error fetching problems" });
  }
};

export const deleteProb = async (req, res) => {
  const { id } = req.params;
  try {
    await Problem.findByIdAndDelete(id);
    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({ message: "Error while deleting the problem" });
  }
};

export const getProbById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    const problemObj = problem.toObject();
    delete problemObj.hiddenTestcases;
    res.status(200).json(problemObj);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  if (!updatedFields.tags) {
    updatedFields.tags = [];
  }

  try {
    const updated = await Problem.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json({
      message: 'Problem updated successfully',
      updated
    });
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({ message: 'Server error while updating problem' });
  }
};

