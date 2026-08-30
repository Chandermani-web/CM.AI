import graph from "../graph/graph.js";
import Interview from "../models/interview.model.js";

export const startInterview = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { type, role, useResume, resume = {} } = req.body;

    if (!type || !role) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing required fields: type and role are required",
        });
    }

    const result = await graph.invoke({
      action: "start",
      role,
      type,
      useResume,
      resume,
    });

    const question = result.question;

    if (!question || question.length === 0) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to generate interview question",
        });
    }

    const interview = await Interview.create({
      userId,
      type,
      role,
      useResume,
      resume,
      questions: [question],
      currentQuestion: 0,
      status: "in-progress",
    });

    return res
      .status(200)
      .json({
        success: true,
        interviewId: interview._id,
        currentQuestion: 0,
        totalQuestions: interview.questions.length,
        question: interview.questions[0],
      });

  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const submitAnswer = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        const { interviewId, answer } = req.body;

        if (!interviewId || !answer) {
            return res.status(400).json({
                message: "Missing required fields: interviewId and answer are required"
            });
        }

        const interview = await Interview.findOne({ _id: interviewId, userId });

        if(!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        if(interview.status === "completed") {
            return res.status(400).json({
                message: "Interview has already been completed"
            });
        }

        const currentQuestionIndex = interview.currentQuestion;

        const currentQuestion = interview.questions[currentQuestionIndex];

        if(!currentQuestion) {
            return res.status(400).json({
                message: "No current question found"
            });
        }

        currentQuestion.userAnswer = answer;

        const completed = interview.currentQuestion + 1 >= interview.questions.length;

        
        const result = await graph.invoke({
            action: "feedback",
            question: currentQuestion.question,
            questions: interview.questions,
            difficulty: currentQuestion.difficulty,
            completed,
            answer,
            role: interview.role,
            type: interview.type,
        });
        
        currentQuestion.feedback = result.feedback;
        
        if(!completed) {
            interview.currentQuestion += 1;
        } 

        if(completed) {
            interview.status = "completed";
            interview.overallScore = result.report.overallScore;
            interview.summary = result.report.summary;
            interview.recommendations = result.report.recommendations;
            interview.strengths = result.report.strengths;
            interview.weaknesses = result.report.weaknesses;
        }

        await interview.save();

        return res.status(200).json({
            success: true,
            completed,
            currentQuestion: interview.currentQuestion,
            totalQuestions: interview.questions.length,
            question: !completed ? interview.questions[interview.currentQuestion] : null,
            feedback: currentQuestion.feedback,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getInterview = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        const { interviewId } = req.params;

        const interview = await Interview.findOne({ _id: interviewId, userId });

        if(!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        return res.status(200).json({
            success: true,
            interview
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}