import Problem from '../models/problem.js'


export const controlCreateProblem = async (req, res) => {
    const {title, description, difficulty, inputFormat, outputFormat, constraints, sampleInput, sampleOutput} = req.body;
    if (
    !title || !description || !inputFormat || !outputFormat ||
    !constraints || !sampleInput || !sampleOutput || !difficulty
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const newProblem = await Problem.create({
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      sampleInput,
      sampleOutput,
      difficulty
    });
    res.status(200).json({message: 'Problem Created Successfully', problem: newProblem});
  } catch (error) {
    console.log('Error creating problem: ', error);
    res.status(500).json({message: "Server error while creating problem"});
  }
};

export const getprobs = async (req, res) =>{
    const problems = await Problem.find();
    res.status(200).json(problems);
};

export const deleteProb = async (req, res) => {
    const {id} = req.params;
    try {
        await Problem.findByIdAndDelete(id);
        res.status(200).json({message: "Problem deleted succesfully"});
    } catch (error) {
        console.error('Error deleting problem: ', error);
        res.status(500).json({message: "Error while deleting the problem"});
    }
};

export const getProbById = async(req, res) => {
    const {id} = req.params;
    try {
        const problem = await Problem.findById(id);
        if(!problem){
            res.status(404).json({message: 'Problem not found'});
        }
        res.status(200).json(problem);
    } catch (error) {
        console.error('Error fetching problem: ', error);
        res.status(500).json({message: 'Server error'});
    }
};

export const updateProblem = async (req, res) => {
    const {id} = req.params;
    const updatedFields = req.body;
    try {
        const updated = await Problem.findByIdAndUpdate(id, updatedFields, {
            new: true,
            runValidators: true,
        });
        if(!updated){
            return res.status(404).json({message: 'Problem not found'});
        }
        res.status(200).json({message: 'Problem updated successfully', updated});
    } catch (error) {
        console.error('Error updating problem: ', error);
        res.status(500).json({message: 'Server error while updating problem '});
    }
};