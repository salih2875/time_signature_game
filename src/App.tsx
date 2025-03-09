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
    title: "Alice In Chains - Them Bones",
    youtubeUrl: "https://www.youtube.com/watch?v=zTuD8k3JvxQ",
    startTime: 3,
    endTime: 13,
    timeSignature: "7/4",
  },
  {
    id: 2,
    title: "Dave Brubeck - Take Five",
    youtubeUrl: "https://www.youtube.com/watch?v=tT9Eh8wNMkw",
    startTime: 10,
    endTime: 30,
    timeSignature: "5/4",
  },
  {
    id: 3,
    title: "Mission: Impossible Theme",
    youtubeUrl: "https://www.youtube.com/watch?v=AvBVGsd4Lzc",
    startTime: 0,
    endTime: 20,
    timeSignature: "5/4",
  },
  {
    id: 4,
    title: "Dionne Warwick - I Say A Little Prayer",
    youtubeUrl: "https://www.youtube.com/watch?v=kafVkPxjLYg",
    startTime: 54,
    endTime: 72,
    timeSignature: "11/4",
  },
  {
    id: 5,
    title: "The Allman Brothers Band - Whipping Post ",
    youtubeUrl: "https://www.youtube.com/watch?v=FUvxRjYqjEQ",
    startTime: 5,
    endTime: 25,
    timeSignature: "11/4",
  },
  {
    id: 6,
    title: "The Beatles -  All You Need Is Love",
    youtubeUrl: "https://www.youtube.com/watch?v=_OuYLGHkrBk",
    startTime: 60,
    endTime: 85,
    timeSignature: "7/4",
  },
  {
    id: 7,
    title: "Peter Gabriel - Solsbury Hill",
    youtubeUrl: "https://www.youtube.com/watch?v=_OO2PuGz-H8",
    startTime: 15,
    endTime: 35,
    timeSignature: "7/4",
  },
  {
    id: 8,
    title: "Radiohead - Everything In Its Right Place",
    youtubeUrl: "https://www.youtube.com/watch?v=onRk0sjSgFU",
    startTime: 0,
    endTime: 30,
    timeSignature: "10/4",
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
  const [timeLeft, setTimeLeft] = useState<number>(90); // Changed to 90 seconds (1:30 minutes)
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
    const savedHighScore = localStorage.getItem("highScore");
    return savedHighScore ? parseInt(savedHighScore) : 0;
  });

  const currentSong = songs[currentSongIndex];

  // Global timer effect ⏳
  useEffect(() => {
    if (isGameOver) return;
    if (timeLeft === 0) {
      setIsGameOver(true); // End game when global timer runs out
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isGameOver]);

  // Timer effect ⏳
  useEffect(() => {
    if (isGameOver) return;
    if (timeLeft === 0) {
      handleSubmit();
      handleNext();
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
    // Removed setTimeLeft(15) to maintain global timer
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
    setTimeLeft(90); // Reset to 90 seconds (1:30 minutes)
    setIsGameOver(false);
    setShowAnswer(false);
    setGuess("");
  };

  return (
    <Container>
      <Header>
        <HP>❤️ HP: {hp}</HP>
        <Score>Score: {score}</Score>
        <HighScore>High Score: {highScore}</HighScore>
      </Header>
      {!isGameOver ? (
        <>
          {/* TODO: adapt video size for mobile */}
          <YouTube
            videoId={extractVideoId(currentSong.youtubeUrl)}
            opts={{
              width: "1000px",
              height: "500px",
              playerVars: {
                autoplay: 1,
                start: currentSong.startTime,
                end: currentSong.endTime,
              },
            }}
          />
          <InputContainer>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter time signature e.g., 4/4"
            />
            <Button onClick={handleSubmit}>Submit ✅</Button>
            {showAnswer && (
              <>
                <Answer correct={guess.trim() === currentSong.timeSignature}>
                  {guess.trim() === currentSong.timeSignature
                    ? "✓ Correct!"
                    : `✗ Wrong! Correct answer: ${currentSong.timeSignature}`}
                </Answer>
              </>
            )}
            {showAnswer && <Button onClick={handleNext}>Next ▶️</Button>}
          </InputContainer>
          <TimerDisplay>
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} ⏳
          </TimerDisplay>
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
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  text-align: left;
`;

const HP = styled.div`
  font-size: 1.2em;
  margin-bottom: 5px;
`;

const Score = styled.div`
  font-size: 1.2em;
  margin-bottom: 5px;
`;

const HighScore = styled.div`
  font-size: 1.2em;
`;

const InputContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  input {
    padding: 8px;
    font-size: 1em;
    margin-bottom: 10px;
    width: 280px; /* Increased width to fit placeholder text */
    box-sizing: border-box;

    &::placeholder {
      font-size: 0.9em; /* Slightly smaller placeholder text */
      opacity: 0.8;
    }

    @media (max-width: 480px) {
      width: 240px;
      &::placeholder {
        font-size: 0.8em;
      }
    }
  }

  button {
    padding: 8px 16px;
    margin: 5px;
    font-size: 1em;
    cursor: pointer;
    border: none;
    border-radius: 4px;
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

const Answer = styled.div<{ correct: boolean }>`
  margin-top: 10px;
  font-size: 1.1em;
  color: ${(props) => (props.correct ? "#4caf50" : "#f44336")};
  font-weight: bold;
`;

const TimerDisplay = styled.div`
  margin-top: 10px;
  font-size: 1.2em;
`;

const GameOverContainer = styled.div`
  text-align: center;
  margin-top: 100px;
`;

const FinalScore = styled.div`
  font-size: 1.3em;
  margin-top: 10px;
`;

const HighScoreDisplay = styled.div`
  font-size: 1.3em;
  margin-top: 10px;
`;
