const axios = require("axios");

// Load environment variables
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_KEY;
const OPENAPI_ORG = process.env.OPENAPI_ORG;
const OPENAPI_PROJ = process.env.OPENAPI_PROJ;

const RESPONSE_JSON = {
  "1": {
    "mcq": "multiple choice question",
    "options": {
      "a": "choice here",
      "b": "choice here",
      "c": "choice here",
      "d": "choice here",
    },
    "correct": "correct answer",
  },
  "2": {
    "mcq": "multiple choice question",
    "options": {
      "a": "choice here",
      "b": "choice here",
      "c": "choice here",
      "d": "choice here",
    },
    "correct": "correct answer",
  },
  "3": {
    "mcq": "multiple choice question",
    "options": {
      "a": "choice here",
      "b": "choice here",
      "c": "choice here",
      "d": "choice here",
    },
    "correct": "correct answer",
  },
};

const genQuiz = async (req, res, next) => {
  try {
    const { filedata, number, subject, tone } = req.body;

    // Debugging: Log the environment variables and request body
    console.log("Using API Key:", OPENAI_API_KEY ? "Present" : "Missing");
    console.log("Using OpenAI Organization:", OPENAPI_ORG);
    console.log("Using OpenAI Project:", OPENAPI_PROJ);
    console.log("Request Body:", req.body);

    // Generate Quiz
    const quizCompletion = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert MCQ creator." },
          {
            role: "user",
            content: `
            ### REF CONTENT
            ${filedata}
            
            Your task is to create a quiz of ${number} multiple choice questions on topic ${subject} for students in ${tone} tone.

            ### Instructions:
            - Each question must conform to the provided text REF CONTENT.
            - Strictly follow the RESPONSE_JSON format below.
            - If the format is not adhered to, the response will be rejected.

            ### RESPONSE JSON
            ${JSON.stringify(RESPONSE_JSON, null, 2)}

            ### Create the Quiz Below without any other details:`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Organization": OPENAPI_ORG,
          "OpenAI-Project": OPENAPI_PROJ,
        },
      }
    );

    const quiz = quizCompletion.data.choices[0].message.content;

    // Review Quiz
    const reviewCompletion = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert Multiple Choice Quiz (MCQ) creator and English grammarian. " },
          {
            role: "user",
            content: `
                      Provided Quiz -
                      ${quiz}
                      Evaluate the provided quiz for complexity and student suitability, and adjust any questions that do not align with the target cognitive and analytical abilities. Follow these instructions carefully:

                      1. **Analysis Requirements**:
                        - Evaluate the complexity of the quiz.
                        - Ensure the questions match the target student abilities.

                      2. **Editing Requirements**:
                        - Update questions, if needed, to align with the student's cognitive and analytical levels.
                        - Ensure all questions have grammatically correct and clear phrasing.

                      3. **Output Format**:
                        - Provide the response **strictly in the following JSON format**:
                          {
                            "analysis": "string (max 50 words)",
                            "quiz": {
                              "question_number": {
                                "mcq": "string",
                                "options": {
                                  "a": "string",
                                  "b": "string",
                                  "c": "string",
                                  "d": "string"
                                },
                                "correct": "string"
                              }
                            }
                          }
                          
                        - Any deviation from this format will result in rejection of the response.

                      4. **No Additional Text**:
                        - Do not include explanations, context, or additional text outside the JSON structure.
                      `,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Organization": OPENAPI_ORG,
          "OpenAI-Project": OPENAPI_PROJ,
        },
      }
    );

    const reviewedquiz = reviewCompletion.data.choices[0].message.content;

    res.status(200).json({ quiz: JSON.parse(reviewedquiz) });
  } catch (error) {
    console.error("Error in genQuiz:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to generate or review quiz.",
      details: error.response?.data || error.message,
    });
  }
};

// Export the controller
module.exports = { genQuiz };