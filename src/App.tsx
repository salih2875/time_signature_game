// App.tsx
import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import styled from "styled-components";

type Song = {
  id: number;
  title: string;
  youtubeUrl: string;
  startTime: number;
  endTime: number;
  timeSignature: string;
};

const songs: Song[] = [
  {
    id: 1,
    title: "Song A",
    youtubeUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
    startTime: 75,
    endTime: 133,
    timeSignature: "5/4",
  },
  {
    id: 2,
    title: "Song B",
    youtubeUrl: "https://www.youtube.com/watch?v=YYYYYYYYYYY",
    startTime: 30,
    endTime: 90,
    timeSignature: "7/8",
  },
];

const extractVideoId = (url: string): string => {
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};

const App: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [guess, setGuess] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [hp, setHp] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
    const savedHighScore = localStorage.getItem("highScore");
    return savedHighScore ? parseInt(savedHighScore) : 0;
  });

  const currentSong = songs[currentSongIndex];

  // Timer effect ⏳
  useEffect(() => {
    if (isGameOver) return;
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isGameOver]);

  // Handle guess submission 🎯
  const handleSubmit = () => {
    if (showAnswer) return;
    setShowAnswer(true);
    if (guess.trim() === currentSong.timeSignature) {
      setScore((prev) => prev + 10);
    } else {
      setHp((prev) => prev - 1);
    }
    const potentialScore =
      guess.trim() === currentSong.timeSignature ? score + 10 : score;
    if (potentialScore > highScore) {
      localStorage.setItem("highScore", potentialScore.toString());
      setHighScore(potentialScore);
    }
    if (hp - (guess.trim() === currentSong.timeSignature ? 0 : 1) <= 0) {
      setIsGameOver(true);
    }
  };

  // Load next song or loop back 🎶
  const handleNext = () => {
    setGuess("");
    setTimeLeft(15);
    setShowAnswer(false);
    if (currentSongIndex + 1 < songs.length) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(0);
    }
  };

  // Reset game on "Play Again"
  const handlePlayAgain = () => {
    setScore(0);
    setHp(3);
    setCurrentSongIndex(0);
    setTimeLeft(15);
    setIsGameOver(false);
    setShowAnswer(false);
    setGuess("");
  };

  return (
    <Container>
      <Header>
        <StatusItem>❤️ HP: {hp}</StatusItem>
        <StatusItem>Score: {score}</StatusItem>
        <StatusItem>High Score: {highScore}</StatusItem>
      </Header>
      {!isGameOver ? (
        <>
          <VideoContainer>
            <YouTube
              videoId={extractVideoId(currentSong.youtubeUrl)}
              opts={{
                width: "100%",
                height: "100%",
                playerVars: {
                  autoplay: 1,
                  start: currentSong.startTime,
                  end: currentSong.endTime,
                },
              }}
            />
          </VideoContainer>
          <InputContainer>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter time signature e.g., 4/4"
            />
            <Button onClick={handleSubmit}>Submit ✅</Button>
            {showAnswer && (
              <Answer>Correct Answer: {currentSong.timeSignature}</Answer>
            )}
            {showAnswer && <Button onClick={handleNext}>Next ▶️</Button>}
          </InputContainer>
          <TimerDisplay>Time Left: {timeLeft} s ⏳</TimerDisplay>
        </>
      ) : (
        <GameOverContainer>
          <h2>Game Over 😢</h2>
          <FinalScore>Your final score: {score}</FinalScore>
          <HighScoreDisplay>High Score: {highScore}</HighScoreDisplay>
          <Button onClick={handlePlayAgain}>Play Again 🔄</Button>
        </GameOverContainer>
      )}
    </Container>
  );
};

export default App;

/* Styled Components for a responsive layout */
const Container = styled.div`
  background-color: #121212;
  color: #fff;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const StatusItem = styled.div`
  font-size: 1.2em;
  margin: 5px;
`;

const VideoContainer = styled.div`
  width: 100%;
  max-width: 800px;
  position: relative;
  background: #000;
  aspect-ratio: 16 / 9;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;

  input {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    margin-bottom: 10px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #444;
    background: #222;
    color: #fff;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  font-size: 1em;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #1e88e5;
  color: #fff;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1565c0;
  }
`;

const Answer = styled.div`
  margin-top: 10px;
  font-size: 1.1em;
`;

const TimerDisplay = styled.div`
  margin-top: 10px;
  font-size: 1.2em;
`;

const GameOverContainer = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const FinalScore = styled.div`
  font-size: 1.3em;
  margin-top: 10px;
`;

const HighScoreDisplay = styled.div`
  font-size: 1.3em;
  margin-top: 10px;
`;
