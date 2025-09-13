const express = require("express");
const app = express.Router();
const multer = require("multer");
const upload = multer();
const pdfParse = require("pdf-parse");   // <-- this line is missing in your code

const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI("AIzaSyC_BqCt7wP4s9Z6Melk_C9unFm0jqjrlcU");

//paid api
const genAI = new GoogleGenerativeAI("AIzaSyBiKKS9MYGdYdNEqvUt04asxfdTaC8Mb-M");

app.get("/", (req, res) => { res.send("Running ....") })
    ; app.post("/api/studyplan", async (req, res) => {
        try {
            const { subjects, exams, hours } = req.body;

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
    You are an AI study planner.
    Subjects: ${subjects}
    Exams: ${exams}
    Available hours per day: ${hours}
    Create a day-wise study timetable with balanced time allocation and revision.
    Format as JSON like:
    {
      "Day 1": "2 hrs Math, 2 hrs Physics, 1 hr Chemistry",
      "Day 2": "..."
    }
    `;

            const result = await model.generateContent(prompt);

            res.json({ plan: result.response.text() });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Something went wrong" });
        }
    });


app.post("/ask", upload.fields([

    { name: "textbook", maxCount: 1 }
]), async (req, res) => {
    try {
        const question = req.body.question;
        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        const textbookFile = req.files["textbook"]?.[0];

        if (!syllabusFile || !textbookFile) {
            return res.status(400).json({ error: "Both syllabus and textbook PDFs are required" });
        }

        const textbookData = await pdfParse(textbookFile.buffer);

        const prompt = `
        Answer this question based on the syllabus and textbook:
        Question: ${question}
        Textbook: ${textbookData.text}
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);

        res.json({ answer: result.response.text() });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/flashcards", upload.fields([
    { name: "textbook", maxCount: 1 }
]), async (req, res) => {
    console.log("Flashcard called");
    try {
        console.log("Flashcardd Called")
        const textbookFile = req.files["textbook"]?.[0];
        if (!textbookFile) {
            return res.status(400).json({ error: "Textbook PDF is required" });
        }

        // Extract text from PDF
        const textbookData = await pdfParse(textbookFile.buffer);
        const pdfText = textbookData.text;

        // Prompt Gemini AI to generate flashcards in structured JSON
        const prompt = `
    You are a flashcard generator.

    Rules:
    1. Generate only valid JSON, do NOT include any text outside JSON.
    2. Use this structure exactly:

    {
      "flashcards": [
        { "question": "Question text", "answer": "Answer text" },
        ...
      ]
    }

    3. Do NOT include any backslashes (\\) for line breaks or escape characters.
    4. Remove extra newlines inside strings. All text should be plain and parsable.
    5. Return only JSON, nothing else.

    Input text:
    ${pdfText}
    `;


        // Call Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);

        // The AI may return JSON as string, so parse it
        let flashcardsJSON;
        try {
            console.log(result.response.text());
            flashcardsJSON = result.response.text()
        } catch (e) {
            console.error("Failed to parse AI response:", e);
            return res.status(500).json({ error: "AI returned invalid JSON" });
        }

        res.json({ "qna": flashcardsJSON });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});


module.exports = app;
