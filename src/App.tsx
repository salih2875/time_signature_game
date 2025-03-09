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

    if (guess.trim() === currentSong.timeSignature) {
      // Correct answer - add score and move to next song immediately
      setScore((prev) => prev + 10);

      // Update high score if needed
      if (score + 10 > highScore) {
        localStorage.setItem("highScore", (score + 10).toString());
        setHighScore(score + 10);
      }

      // Move to next song immediately
      handleNext();
    } else {
      // Wrong answer - show the correct answer
      setShowAnswer(true);
      setHp((prev) => prev - 1);

      // Check if game over
      if (hp - 1 <= 0) {
        setIsGameOver(true);
      }
    }
  };

  // Load next song randomly 🎲
  const handleNext = () => {
    setGuess("");
    setShowAnswer(false);

    // Generate a random index different from the current one
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentSongIndex && songs.length > 1);

    setCurrentSongIndex(randomIndex);
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
      {!isGameOver && (
        <Header>
          <HP>❤️ HP: {hp}</HP>
          <Score>Score: {score}</Score>
          <HighScore>High Score: {highScore}</HighScore>
        </Header>
      )}
      {!isGameOver ? (
        <>
          <YouTube
            videoId={extractVideoId(currentSong.youtubeUrl)}
            opts={{
              width: "1000px",
              height: "500px",
              playerVars: {
                autoplay: 1,
                start: currentSong.startTime,
                end: currentSong.endTime,
                mute: 0,
                controls: 1,
              },
            }}
            onReady={(event) => {
              event.target.playVideo();
            }}
          />
          <InputContainer>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter time signature e.g., 4/4"
            />
            {!showAnswer && <Button onClick={handleSubmit}>Submit ✅</Button>}
            {showAnswer && (
              <>
                <Answer correct={guess.trim() === currentSong.timeSignature}>
                  {guess.trim() === currentSong.timeSignature
                    ? "✓ Correct!"
                    : `✗ Wrong! Correct answer: ${currentSong.timeSignature}`}
                </Answer>
                <Button onClick={handleNext}>Next ▶️</Button>
              </>
            )}
          </InputContainer>
          <TimerDisplay>
            Time Left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")} ⏳
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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center content vertically */
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.div`
  position: center;
  // top: 10px;
  // left: 10px;
  text-align: left;
  // background-color: rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
  padding: 10px;
  border-radius: 8px;
  z-index: 10;
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
  width: 100%;
  max-width: 400px; /* Limit width for better mobile experience */
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  input {
    padding: 10px;
    font-size: 1em;
    margin-bottom: 10px;
    width: 100%;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #1e1e1e;
    color: #fff;

    &::placeholder {
      color: #888;
    }
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  margin: 5px;
  font-size: 1em;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #1e88e5, #1565c0);
  color: #fff;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, #1976d2, #0d47a1);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const Answer = styled.div<{ correct: boolean }>`
  margin-top: 10px;
  font-size: 1.1em;
  color: ${(props) => (props.correct ? "#4caf50" : "#f44336")};
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  text-align: center;
`;

const TimerDisplay = styled.div`
  margin-top: 10px;
  font-size: 1.2em;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  max-width: 200px;
  text-align: center;
`;

const GameOverContainer = styled.div`
  text-align: center;
  margin-top: 50px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const FinalScore = styled.div`
  font-size: 1.3em;
  margin-top: 10px;
`;

const HighScoreDisplay = styled.div`
  font-size: 1.3em;
  margin-top: 10px;
`;
