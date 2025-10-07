import { useState } from 'react';
import { TopicSelection } from './components/TopicSelection';
import { QuizLoader } from './components/QuizLoader';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { generateQuizQuestions, generateFeedback } from './services/aiService';

function App() {
  const [screen, setScreen] = useState('topic-selection');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);

  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic);
    setScreen('loading');
    setError(null);

    try {
      const quizQuestions = await generateQuizQuestions(topic.name);
      setQuestions(quizQuestions);
      setScreen('quiz');
      setCurrentQuestionIndex(0);
      setAnswers({});
    } catch (err) {
      console.error('Error generating questions:', err);
      setError('Failed to generate quiz questions. Please try again.');
      setScreen('topic-selection');
    }
  };

  const handleSelectAnswer = (optionText) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionText,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleComplete = async () => {
    if (!questions.length) return;

    let finalScore = 0;
    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.answer) finalScore++;
    });

    setScore(finalScore);
    // setScreen('loading');

    try {
      const feedbackMsg = await generateFeedback(
        selectedTopic?.name || 'this topic',
        finalScore,
        questions.length
      );
      setFeedback(feedbackMsg);
      setScreen('results');
    } catch (err) {
      console.error('Error generating feedback:', err);
      const percentage = Math.round((finalScore / questions.length) * 100);
      setFeedback(
        `Great job! You scored ${finalScore} out of ${questions.length} (${percentage}%). Keep learning and improving!`
      );
      setScreen('results');
    }
  };

  const handleRestart = () => {
    setScreen('topic-selection');
    setSelectedTopic(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setFeedback('');
    setError(null);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      {screen === 'topic-selection' && (
        <>
          <TopicSelection onSelectTopic={handleTopicSelect} />
          {error && (
            <div className="fixed bottom-4 right-4 bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-lg max-w-md">
              <p className="font-medium">{error}</p>
            </div>
          )}
        </>
      )}

      {screen === 'loading' && selectedTopic && (
        <QuizLoader topicName={selectedTopic.name} />
      )}

      {screen === 'quiz' && currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQuestion.id]}
          onSelectAnswer={handleSelectAnswer}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentQuestionIndex > 0}
          canGoNext={currentQuestionIndex < questions.length - 1 && !!answers[currentQuestion.id]}
          onComplete={handleComplete}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      )}

      {screen === 'results' && selectedTopic && (
        <QuizResults
          topicName={selectedTopic.name}
          questions={questions}
          answers={answers}
          score={score}
          feedback={feedback}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}

export default App;
