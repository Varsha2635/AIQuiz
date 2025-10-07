---

# 📘 AI-Assisted Knowledge Quiz

An interactive web app that generates quizzes on different topics using **Google Gemini AI**. Users select a topic, answer AI-generated multiple-choice questions, and receive personalized AI feedback.

---

---


## 🔗 Important Links

Hosted App: https://ai-quiz-mqbu.vercel.app/

GitHub Repository: https://github.com/Varsha2635/AIQuiz

---

## 🚀 Features

* Select from curated topics (AI, Tech, Science, Wellness, History, etc.).
* Quizzes are dynamically generated using **Gemini 2.5 Flash** API.
* 5 unique MCQs per quiz.
* Real-time progress tracking and navigation between questions.
* AI-generated **personalized feedback** after quiz completion.
* Review answers with correct/incorrect highlights.
* Responsive UI built with **React + TailwindCSS**.

---

## 🏗️ Architecture & State Management

### **Architecture**

```
Frontend (React) ↔ Backend (Express + Node) ↔ Gemini AI (Google Generative AI API)
```

1. **Frontend (React)**

   * Topic selection, quiz UI, results page.
   * Fetches quiz data and feedback via `aiService.js`.
   * Manages state transitions between **topic-selection → loading → quiz → results**.

2. **Backend (Node + Express)**

   * `/quiz` endpoint: prompts Gemini to generate **5 MCQs** in strict JSON format.
   * `/feedback` endpoint: sends user score and receives **friendly feedback**.
   * Ensures AI output is valid JSON (`safeParseJSON`).

3. **Gemini AI**

   * Generates MCQs + answers.
   * Creates personalized quiz feedback messages.

---

### **State Management**

* Used **React useState hooks** for simple, predictable state handling.
* `screen`: tracks which screen to show (`topic-selection`, `loading`, `quiz`, `results`).
* `selectedTopic`: stores chosen topic object.
* `questions`: holds AI-generated quiz questions.
* `answers`: dictionary mapping `question.id → selectedAnswer`.
* `score`: final score after completion.
* `feedback`: AI-generated feedback message.
* `error`: error messages from failed API calls.

**Why use useState instead of Redux/Context?**

* The app has **localized state** (mainly inside `App.js`) and is not overly complex.
* Redux/Context would be overkill here.
* `useState` is enough to manage transitions and UI reactivity.

---

## 📝 Prompts Used & Refinements

### 1. **Quiz Generation Prompt**

```txt
Generate exactly 5 multiple-choice questions on the topic "<TOPIC>".
Return only valid JSON in this structure (no extra text):
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "B"
    }
  ]
}
```

🔧 **Refinements Made:**

* Restricted Gemini to **valid JSON only** (to avoid extra explanations).
* Added error handling (`safeParseJSON`) in case Gemini outputs text before/after JSON.
* Converted `"answer": "B"` into the **full option string** in `aiService.js`.

---

### 2. **Feedback Prompt**

```txt
The user scored <SCORE>/<TOTAL> on a quiz about "<TOPIC>".
Write a short, personalized feedback message (2–3 friendly sentences).
```

🔧 **Refinements Made:**

* Limited response length (2–3 sentences).
* Handled fallback feedback in frontend if API fails.

---

## 📸 Screenshots

### 1. **Topic Selection**

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/10bbe6e1-0131-493b-a811-ad2bcf4f5a95" />


### 2. **Quiz Loader**

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f2796e69-f6cb-4860-ae2b-4407d17c38b6" />


### 3. **Quiz Question**

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1fa7a40b-46f9-4847-8a6b-3aa7ee25c960" />


### 4. **Quiz Results**

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d2fb812e-808c-418c-8c8d-3a9cdea1e736" />


---

## ⚠️ Known Issues

* **AI sometimes outputs malformed JSON** (extra text, missing commas). Mitigated with `safeParseJSON`, but not 100% foolproof.
* **Answer correctness depends on AI reliability** (sometimes AI marks ambiguous answers).
* **API latency**: Quiz generation may take several seconds.
* **No persistence**: Quiz data is lost on refresh (could be improved with local storage or backend DB).

---

## 🔮 Potential Improvements

* ✅ Add **user authentication & history tracking** (save scores per user).
* ✅ Allow **difficulty levels** (easy/medium/hard).
* ✅ Provide **explanations for answers** via AI, not just correct/incorrect.
* ✅ Add **timer & leaderboard** for gamified experience.
* ✅ Offline **sample quizzes** in case API fails.
* ✅ Deploy backend with **cloud server** and frontend with **Vercel/Netlify**.

---

## ⚙️ Installation & Setup

### 1. Clone Repo

```bash
git clone <repo-url>
cd ai-quiz-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Create `.env` file:

```
API_KEY=your_gemini_api_key_here
PORT=5000
```

### 4. Start Backend

```bash
cd backend
node index.js
```

### 5. Start Frontend

```bash
cd frontend
npm start
```

---

