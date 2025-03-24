// App.tsx
import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import styled from "styled-components";

// First, let's update the Song type to support multiple time signatures
type Song = {
  id: number;
  title: string;
  youtubeUrl: string;
  startTime: number;
  endTime: number;
  timeSignature: string | string[]; // Can be a single string or array of strings
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
  {
    id: 9,
    title: "Animals - Muse",
    youtubeUrl: "https://www.youtube.com/watch?v=WnJz4eUV5qM",
    startTime: 30,
    endTime: 50,
    timeSignature: "5/4",
  },
  {
    id: 10,
    title: "Stone Temple Pilots - Pretty Penny",
    youtubeUrl: "https://www.youtube.com/watch?v=yL3CVO0nWE4",
    startTime: 30,
    endTime: 50,
    timeSignature: "9/4",
  },
  {
    id: 11,
    title: "Yes - The Fish",
    youtubeUrl: "https://www.youtube.com/watch?v=yxXMJKCI9F0",
    startTime: 0,
    endTime: 30,
    timeSignature: ["7/8", "7/4"], // Multiple correct answers
  },
  {
    id: 12,
    title: "Pearl Jam - Last Exit",
    youtubeUrl: "https://www.youtube.com/watch?v=YQRyhKmkUUE",
    startTime: 20,
    endTime: 45,
    timeSignature: "5/4",
  },
  {
    id: 13,
    title: "Sting - Seven Days",
    youtubeUrl: "https://www.youtube.com/watch?v=pG7_gceIFL4",
    startTime: 0,
    endTime: 30,
    timeSignature: ["5/8", "5/4"],
  },
  {
    id: 14,
    title: "Temple Of The Dog - Pushin' Forward Back",
    youtubeUrl: "https://www.youtube.com/watch?v=6DCmznTKXJg",
    startTime: 0,
    endTime: 35,
    timeSignature: ["7/8", "7/4"],
  },
  {
    id: 15,
    title: "Karnivool - Goliath",
    youtubeUrl: "https://www.youtube.com/watch?v=sDKsosOvVmw",
    startTime: 1,
    endTime: 45,
    timeSignature: "27/4",
  },
  {
    id: 16,
    title: "U.K. - In The Dead Of Night ",
    youtubeUrl: "https://www.youtube.com/watch?v=czj3_5VI7YE",
    startTime: 14,
    endTime: 35,
    timeSignature: ["7/8", "7/4"],
  },
  {
    id: 17,
    title: "The Police - Synchronicity I",
    youtubeUrl: "https://www.youtube.com/watch?v=Si5CSpUCDGY",
    startTime: 0,
    endTime: 30,
    timeSignature: ["6/4", "6/8"],
  },
  {
    id: 18,
    title: "Foo Fighters - Times Like These",
    youtubeUrl: "https://www.youtube.com/watch?v=rhzmNRtIp8k",
    startTime: 7,
    endTime: 20,
    timeSignature: ["7/8", "7/4"],
  },
  {
    id: 19,
    title: "TOOL - Right In Two",
    youtubeUrl: "https://www.youtube.com/watch?v=bndL7wwAj0U",
    startTime: 315,
    endTime: 345,
    timeSignature: ["11/4", "11/8"],
  },
  {
    id: 20,
    title: "Frank Zappa - Keep It Greasey",
    youtubeUrl: "https://www.youtube.com/watch?v=FwAwA7SlD7M",
    startTime: 35,
    endTime: 55,
    timeSignature: "19/16",
  },
  {
    id: 21,
    title: "Rush - Tom Sawyer",
    youtubeUrl: "https://www.youtube.com/watch?v=auLBLk4ibAk",
    startTime: 95,
    endTime: 120,
    timeSignature: ["7/4", "7/8"],
  },
  {
    id: 22,
    title: "Pink Floyd - Money",
    youtubeUrl: "https://www.youtube.com/watch?v=2aW7HweAf3o",
    startTime: 12,
    endTime: 35,
    timeSignature: ["7/4", "7/8"],
  },
  {
    id: 23,
    title: "Near's Theme (A) - Death Note",
    youtubeUrl: "https://www.youtube.com/watch?v=WJW_ldC7sUA",
    startTime: 0,
    endTime: 20,
    timeSignature: ["7/4", "7/8"],
  },
  {
    id: 24,
    title: "Mello's Theme (A) - Death Note",
    youtubeUrl: "https://www.youtube.com/watch?v=BA4l6jrOSes",
    startTime: 100,
    endTime: 135,
    timeSignature: ["3/4"],
  },
  {
    id: 25,
    title: "Marvel’s Ant Man: Official Main Theme (by Christophe Beck)",
    youtubeUrl: "https://www.youtube.com/watch?v=O_5NwVy8L5M&t=12s",
    startTime: 65,
    endTime: 90,
    timeSignature: ["7/4", "7/8"],
  },
  {
    id: 26,
    title: "Coldplay - A L I E N S",
    youtubeUrl: "https://www.youtube.com/watch?v=we-LaiQNY5s",
    startTime: 120,
    endTime: 150,
    timeSignature: ["5/4"],
  },
  {
    id: 27,
    title: "Bane's Theme - Hans Zimmer",
    youtubeUrl: "https://www.youtube.com/watch?v=uF6IIp6YMjo",
    startTime: 20,
    endTime: 40,
    timeSignature: ["5/4"],
  },
  {
    id: 28,
    title: "Closure - Taylor Swift",
    youtubeUrl: "https://www.youtube.com/watch?v=AIFnKqIeEdY",
    startTime: 60,
    endTime: 90,
    timeSignature: "5/4",
  },
  {
    id: 29,
    title: "15 Step - Radiohead",
    youtubeUrl: "https://www.youtube.com/watch?v=xpqk9MD6vLM",
    startTime: 60,
    endTime: 90,
    timeSignature: "5/4",
  },
  {
    id: 30,
    title: "5/4 - Gorillaz",
    youtubeUrl: "https://www.youtube.com/watch?v=z46bm9HR7L4",
    startTime: 40,
    endTime: 60,
    timeSignature: "5/4",
  },
  {
    id: 31,
    title: "Wind - Akeboshi",
    youtubeUrl: "https://www.youtube.com/watch?v=WqGOaOHu5uY",
    startTime: 0,
    endTime: 30,
    timeSignature: "5/4",
  },
  {
    id: 32,
    title: "Kamisama no shitauchi - Akeboshi",
    youtubeUrl: "https://www.youtube.com/watch?v=LBCraVc8gyw",
    startTime: 0,
    endTime: 30,
    timeSignature: "5/4",
  },
  {
    id: 33,
    title: "Alien - Lamb",
    youtubeUrl: "https://www.youtube.com/watch?v=M22hJtt_7LE",
    startTime: 35,
    endTime: 60,
    timeSignature: "7/4",
  },
  {
    id: 34,
    title: "Saint Augustine In Hell - Sting",
    youtubeUrl: "https://www.youtube.com/watch?v=YdnZh-CLMlM",
    startTime: 45,
    endTime: 90,
    timeSignature: "7/4",
  },
  {
    id: 35,
    title: "Mother - The Police",
    youtubeUrl: "https://www.youtube.com/watch?v=d56MfuZAfwI",
    startTime: 30,
    endTime: 60,
    timeSignature: "7/4",
  },
  {
    id: 36,
    title: "TOOL - Ticks & Leeches",
    youtubeUrl: "https://www.youtube.com/watch?v=q0BOpkA2Vs4",
    startTime: 0,
    endTime: 30,
    timeSignature: "7/4",
  },
  {
    id: 37,
    title: "What Would I Want? Sky - Animal Collective",
    youtubeUrl: "https://www.youtube.com/watch?v=YoXFmo50YBI",
    startTime: 180,
    endTime: 210,
    timeSignature: "7/8",
  },
  {
    id: 38,
    title: "Wonder Woman Main Theme - Hans Zimmer",
    youtubeUrl: "https://www.youtube.com/watch?v=tI2ASp0f7GU",
    startTime: 40,
    endTime: 70,
    timeSignature: "7/8",
  },
  {
    id: 39,
    title: "World Away - Tweedy",
    youtubeUrl: "https://www.youtube.com/watch?v=MqwNk9FVhs0",
    startTime: 0,
    endTime: 30,
    timeSignature: "7/4",
  },
  {
    id: 40,
    title: "Celestial Terrestrial Commuters - Mahavishnu Orchestra",
    youtubeUrl: "https://www.youtube.com/watch?v=HDkipPU81f0",
    startTime: 0,
    endTime: 60,
    timeSignature: ["19/16", "19/8"],
  },
  {
    id: 41,
    title: "Hell's Bells - Bruford",
    youtubeUrl: "https://www.youtube.com/watch?v=QcZ6RuXu0aA",
    startTime: 0,
    endTime: 60,
    timeSignature: ["19/8", "19/16"],
  },
  {
    id: 42,
    title: "Hollow - Björk",
    youtubeUrl: "https://www.youtube.com/watch?v=Wa1A0pPc-ik",
    startTime: 0,
    endTime: 60,
    timeSignature: ["17/8", "17/16", "17/4"],
  },
  {
    id: 42,
    title: "Moon - Björk",
    youtubeUrl: "https://www.youtube.com/watch?v=br2s0xJyFEM",
    startTime: 0,
    endTime: 60,
    timeSignature: ["17/8", "17/16", "17/4"],
  },
];

const extractVideoId = (url: string): string => {
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};

const App: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(() =>
    Math.floor(Math.random() * songs.length)
  );
  const [playedSongs, setPlayedSongs] = useState<Set<number>>(new Set());
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

  // Handle guess submission 🎯
  const handleSubmit = () => {
    if (showAnswer) return;

    const correctAnswers = Array.isArray(currentSong.timeSignature)
      ? currentSong.timeSignature
      : [currentSong.timeSignature];

    if (correctAnswers.includes(guess.trim())) {
      setScore((prev) => prev + 10);

      if (score + 10 > highScore) {
        localStorage.setItem("highScore", (score + 10).toString());
        setHighScore(score + 10);
      }

      handleNext();
    } else {
      setShowAnswer(true);
      setHp((prev) => prev - 1);

      if (hp - 1 <= 0) {
        setIsGameOver(true);
      }
    }
  };

  // Load next song randomly 🎲
  const handleNext = () => {
    setGuess("");
    setShowAnswer(false);

    let randomIndex;
    const newPlayedSongs = new Set(playedSongs);
    newPlayedSongs.add(currentSongIndex);

    if (newPlayedSongs.size === songs.length) {
      setIsGameOver(true); // End game if all songs have been played
      return;
    }

    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (newPlayedSongs.has(randomIndex));

    setPlayedSongs(newPlayedSongs);
    setCurrentSongIndex(randomIndex);
  };

  // Reset game on "Play Again"
  const handlePlayAgain = () => {
    setScore(0);
    setHp(3);
    setPlayedSongs(new Set());
    setCurrentSongIndex(Math.floor(Math.random() * songs.length)); // Set to a random index
    setTimeLeft(90); // Reset to 90 seconds (1:30 minutes)
    setIsGameOver(false);
    setShowAnswer(false);
    setGuess("");
  };

  return (
    <Container>
      {!isGameOver ? (
        <MainContent>
          <Header>
            <HP>❤️ HP: {hp}</HP>
            <Score>🏆 Score: {score}</Score>
            <HighScore>🥇 High Score: {highScore}</HighScore>
          </Header>
          <VideoWrapper>
            <YouTube
              videoId={extractVideoId(currentSong.youtubeUrl)}
              opts={{
                // The video will now fill its container
                width: "100%",
                height: "100%",
                playerVars: {
                  autoplay: 1,
                  start: currentSong.startTime,
                  end: currentSong.endTime,
                  mute: 0,
                  controls: 0,
                  disablekb: 1,
                },
              }}
              onReady={(event) => {
                event.target.playVideo();
              }}
            />
          </VideoWrapper>
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
                <Answer
                  correct={
                    Array.isArray(currentSong.timeSignature)
                      ? currentSong.timeSignature.includes(guess.trim())
                      : guess.trim() === currentSong.timeSignature
                  }
                >
                  {Array.isArray(currentSong.timeSignature)
                    ? currentSong.timeSignature.includes(guess.trim())
                      ? "✓ Correct!"
                      : `✗ Wrong! Correct answers: ${
                          Array.isArray(currentSong.timeSignature)
                            ? currentSong.timeSignature.join(" or ")
                            : currentSong.timeSignature
                        }`
                    : guess.trim() === currentSong.timeSignature
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
        </MainContent>
      ) : (
        <GameOverContainer>
          <h2>Game Over</h2>
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
  background-color: #2c3e50;
  color: #fff;
  height: 100vh; /* Fill the full viewport height */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  // padding: 10px;
  box-sizing: border-box;
  overflow: hidden; /* Prevents scrollbars */
`;

const Header = styled.div`
  // flex: 0 0 auto;
  flex: 1;
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px;
  border-radius: 8px;
  width: 50%;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: row;
    gap: 10px;
  }
`;

const HP = styled.div`
  font-size: 1.2em;
`;

const Score = styled.div`
  font-size: 1.2em;
`;

const HighScore = styled.div`
  font-size: 1.2em;
`;

const MainContent = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const VideoWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  /* Allocate about 50% of viewport height to the video */
  flex: 0 0 50vh;
  position: relative;
  margin-bottom: 1rem;

  & iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 600px) {
    flex: 0 0 40vh; /* Reduce video height on smaller screens */
  }
`;

const InputContainer = styled.div`
  // flex: 1 0 auto
  flex: 1;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  input {
    padding: 10px;
    font-size: 1em;
    margin-bottom: 10px;
    width: 95%;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #1e1e1e;
    color: #fff;

    &::placeholder {
      color: #888;
    }
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const Button = styled.button`
  // flex: 1;
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
  flex: 1;
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
  flex: 1;
  margin-top: 1rem;
  font-size: 1.2em;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 8px;
  height: auto;
  width: 15%;
  text-align: center;
  @media (max-width: 600px) {
    width: 100%;
    max-height: 5%;
    flex-direction: row;
  }
`;

const GameOverContainer = styled.div`
  display: flex;
  height: auto;
  margin-top: auto;
  margin-bottom: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const FinalScore = styled.div`
  font-size: 1.3em;
  margin-top: 1rem;
`;

const HighScoreDisplay = styled.div`
  font-size: 1.3em;
  margin-top: 1rem;
`;
