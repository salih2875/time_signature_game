import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import styled from "styled-components";

// Type for song data
type Song = {
  id: number;
  title: string;
  youtubeUrl: string;
  startTime: number;
  endTime: number;
  timeSignature: string;
};

// Example song data stored as JSON-like array
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

// Helper to extract videoId from YouTube URL
const extractVideoId = (url: string): string => {
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};

const App: React.FC = () => {
  // Game state variables 😎
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

  // Submit guess logic 🎯
  const handleSubmit = () => {
    if (showAnswer) return; // Prevent duplicate submissions
    setShowAnswer(true);
    if (guess.trim() === currentSong.timeSignature) {
      setScore((prev) => prev + 10);
    } else {
      setHp((prev) => prev - 1);
    }
    // Update high score if needed 💾
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

  // Load next song or reset timer 🎶
  const handleNext = () => {
    setGuess("");
    setTimeLeft(15);
    setShowAnswer(false);
    if (currentSongIndex + 1 < songs.length) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      // Option: loop through songs or shuffle new list
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
        <HP>
          {Array(hp).fill('❤️').join('')} (HP: {hp})
        </HP>
        <Score>Score: {score}</Score>
        <HighScore>High Score: {highScore}</HighScore>
      </Header>
      {!isGameOver ? (
        <GameContent>
          <VideoContainer>
            <YouTube
              videoId={extractVideoId(currentSong.youtubeUrl)}
              opts={{
                playerVars: {
                  autoplay: 1,
                  start: currentSong.startTime,
                  end: currentSong.endTime,
                },
                width: "100%",
                height: "100%",
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
            <button onClick={handleSubmit}>Submit ✅</button>
            {showAnswer && (
              <Answer>Correct Answer: {currentSong.timeSignature}</Answer>
            )}
            {showAnswer && <button onClick={handleNext}>Next ▶️</button>}
          </InputContainer>
          <TimerDisplay>Time Left: {timeLeft} s ⏳</TimerDisplay>
        </GameContent>
      ) : (
        <GameOverContainer>
          <h2>Game Over 😢</h2>
          <FinalScore>Your final score: {score}</FinalScore>
          <HighScoreDisplay>High Score: {highScore}</HighScoreDisplay>
          <button onClick={handlePlayAgain}>Play Again 🔄</button>
        </GameOverContainer>
      )}
    </Container>
  );
};

export default App;

/* Styled Components */
const Container = styled.div`
  background-color: #121212;
  color: #fff;
  max-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const Header = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  text-align: left;
  z-index: 10;

  @media (min-width: 768px) {
    left: 20px;
    top: 20px;
  }
`;

const HP = styled.div`
  font-size: 1.2em;
  margin-bottom: 5px;

  @media (min-width: 768px) {
    font-size: 1.4em;
  }
`;

const Score = styled.div`
  font-size: 1.2em;
  margin-bottom: 5px;

  @media (min-width: 768px) {
    font-size: 1.4em;
  }
`;

const HighScore = styled.div`
  font-size: 1.2em;

  @media (min-width: 768px) {
    font-size: 1.4em;
  }
`;

// New component to wrap game content
const GameContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-top: 60px;

  @media (min-width: 768px) {
    margin-top: 80px;
  }
`;

const VideoContainer = styled.div`
  margin-top: 60px;
  width: 100%;
  max-width: 560px;
  height: 315px;

  @media (min-width: 768px) {
    max-width: 800px;
    height: 450px;
  }

  @media (min-width: 1200px) {
    max-width: 960px;
    height: 540px;
  }
`;

const InputContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;

  input {
    padding: 8px;
    font-size: 1em;
    margin-bottom: 10px;
    width: 220px;

    @media (min-width: 768px) {
      width: 300px;
      font-size: 1.2em;
      padding: 12px;
    }
  }

  button {
    padding: 8px 16px;
    margin: 5px;
    font-size: 1em;
    cursor: pointer;
    border: none;
    border-radius: 4px;

    @media (min-width: 768px) {
      padding: 12px 24px;
      font-size: 1.2em;
    }
  }

  @media (min-width: 768px) {
    margin-top: 30px;
  }
`;

const Answer = styled.div`
  margin-top: 10px;
  font-size: 1.1em;

  @media (min-width: 768px) {
    font-size: 1.3em;
    margin-top: 15px;
  }
`;

const TimerDisplay = styled.div`
  margin-top: 10px;
  font-size: 1.2em;

  @media (min-width: 768px) {
    font-size: 1.5em;
    margin-top: 20px;
  }
`;

const GameOverContainer = styled.div`
  text-align: center;
  margin-top: 100px;

  @media (min-width: 768px) {
    margin-top: 120px;
  }

  button {
    padding: 8px 16px;
    margin: 5px;
    font-size: 1em;
    cursor: pointer;
    border: none;
    border-radius: 4px;

    @media (min-width: 768px) {
      padding: 12px 24px;
      font-size: 1.2em;
    }
  }
`;

const FinalScore = styled.div`
  font-size: 1.3em;
  margin-top: 10px;

  @media (min-width: 768px) {
    font-size: 1.6em;
    margin-top: 15px;
  }
`;

const HighScoreDisplay = styled.div`
  font-size: 1.3em;
  margin-top: 10px;

  @media (min-width: 768px) {
    font-size: 1.6em;
    margin-top: 15px;
    margin-bottom: 20px;
  }
`;
