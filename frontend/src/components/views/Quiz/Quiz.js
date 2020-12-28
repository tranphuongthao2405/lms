import React, { useState } from 'react';
import { Button } from 'antd';
import './Quiz.css';
import { useHistory } from 'react-router-dom';

function Quiz({
  quizzes, nextVideo, courseId,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const history = useHistory();

  const handleAnswerOptionClick = (answer, answerOption) => {
    if (quizzes[currentQuestion].choices[answer - 1] === answerOption) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizzes.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleClick = () => {
    document.getElementsByClassName('quiz')[0].style.display = 'none';
    history.push(`/video/${nextVideo}/${courseId}`);
    window.location.reload();
  };

  const handleBack = () => {
    history.push('/');
  };

  return (
    <div className="quiz">
      {showScore ? (
        <div className="score-section">
          You scored
          {' '}
          {score}
          {' '}
          out of
          {' '}
          {quizzes.length}
          <br />
          <br />
          {nextVideo ? <Button onClick={handleClick}>Turn to next video</Button> : <Button onClick={handleBack}>Back to home page</Button>}
        </div>
      ) : (
        <>
          {quizzes !== [] && quizzes[currentQuestion] ? (
            <>
              <div className="question-section">
                <div className="question-count">
                  <span>
                    Question
                    {currentQuestion + 1}
                  </span>
                  /
                  {quizzes.length}
                </div>
                <div className="question-text">{quizzes[currentQuestion].question}</div>
              </div>
              <div className="answer-section">
                {quizzes[currentQuestion].choices.map((answerOption) => (
                  <Button
                    onClick={() => handleAnswerOptionClick(quizzes[currentQuestion].answer, answerOption)}
                  >
                    {answerOption}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <div className="score-section">
              This video does not have any quizzes!
              <br />
              <br />
              {nextVideo ? <Button onClick={handleClick}>Turn to next video</Button> : <Button onClick={handleBack}>Back to home page</Button>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Quiz;
