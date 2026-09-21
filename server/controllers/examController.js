const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const ActivityLog = require('../models/ActivityLog');

// Create a new exam
const createExam = async (req, res) => {
  try {
    const { title, description, duration, passMark, maxViolations, startDate, endDate } = req.body;

    if (!title || !duration || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, duration, startDate and endDate are required' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be earlier than end date' });
    }

    const exam = await Exam.create({
      title,
      description,
      duration,
      passMark: passMark !== undefined ? passMark : 40,
      maxViolations: maxViolations !== undefined ? maxViolations : 5,
      startDate,
      endDate,
      createdBy: req.user._id,
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update exam details
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const nextStart = req.body.startDate !== undefined ? req.body.startDate : exam.startDate;
    const nextEnd = req.body.endDate !== undefined ? req.body.endDate : exam.endDate;
    if (new Date(nextStart) >= new Date(nextEnd)) {
      return res.status(400).json({ message: 'Start date must be earlier than end date' });
    }

    const fields = ['title', 'description', 'duration', 'passMark', 'maxViolations', 'startDate', 'endDate', 'isPublished'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) exam[f] = req.body[f];
    });

    const updated = await exam.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete exam and its questions, submissions, and logs
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    await Question.deleteMany({ exam: exam._id });
    await Submission.deleteMany({ exam: exam._id });
    await ActivityLog.deleteMany({ exam: exam._id });
    await exam.deleteOne();

    res.json({ message: 'Exam and all related records deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all exams for admin
const getAllExamsAdmin = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available exams for student
const getAvailableExams = async (req, res) => {
  try {
    const now = new Date();
    const exams = await Exam.find({
      isPublished: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).select('title description duration passMark startDate endDate');

    const submittedExamIds = await Submission.find({ student: req.user._id })
      .distinct('exam');
    const submittedSet = new Set(submittedExamIds.map((id) => id.toString()));

    const result = exams.map((exam) => ({
      ...exam.toObject(),
      submitted: submittedSet.has(exam._id.toString()),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get exam and questions for student attempt
const getExamForAttempt = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam || !exam.isPublished) {
      return res.status(404).json({ message: 'Exam not available' });
    }

    const now = new Date();
    if (now < exam.startDate || now > exam.endDate) {
      return res.status(403).json({ message: 'This exam is not currently open' });
    }

    const alreadySubmitted = await Submission.findOne({ student: req.user._id, exam: exam._id });
    if (alreadySubmitted) {
      return res.status(403).json({ message: 'You have already submitted this exam' });
    }

    const questions = await Question.find({ exam: exam._id }).select('-correctOption');

    res.json({
      _id: exam._id,
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      passMark: exam.passMark,
      maxViolations: exam.maxViolations,
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createExam,
  updateExam,
  deleteExam,
  getAllExamsAdmin,
  getAvailableExams,
  getExamForAttempt,
};