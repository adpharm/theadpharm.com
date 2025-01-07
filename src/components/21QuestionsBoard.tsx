import { Volume2, House, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import Snowfall from "./Snowfall";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GuessResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface Character {
  name: string;
  source: string;
  voiceId: string;
  audioSampleSrc: string;
  audioFolder: string;
}

const characters: Character[] = [
  {
    name: "Santa Claus",
    source: "/santa.webp",
    voiceId:
      "s3://voice-cloning-zero-shot/e5b701f9-5b39-4d4a-a0dc-254956f607c0/original/manifest.json",
    audioSampleSrc: "/audio/santa-speech-sample.mp3",
    audioFolder: "santa",
  },
  {
    name: "Kevin McCallister",
    source: "/kevin.webp",
    voiceId:
      "s3://voice-cloning-zero-shot/0dd43d3f-95d8-4801-bb29-7b34e17b3326/original/manifest.json",
    audioSampleSrc: "/audio/kevin-speech-sample.mp3",
    audioFolder: "kevin",
  },
  {
    name: "The Grinch",
    source: "/grinch.webp",
    voiceId:
      "s3://voice-cloning-zero-shot/f77dcd72-d997-47de-8505-9828b8bf59c6/original/manifest.json",
    audioSampleSrc: "/audio/grinch-speech-sample.mp3",
    audioFolder: "grinch",
  },
];

const prompt: Message[] = [
  {
    role: "system",
    content: `You are an AI playing a 21-question Christmas character guessing game, similar to Akinator. The user is thinking of a Christmas-themed character.

        **INSTRUCTIONS:**
        1. You will ask up to 21 yes/no/maybe questions, one per response, strictly in the format:  
        "[Your yes/no/maybe question]"  
        Example: "Is your character fictional?"
        
        2. You must wait for the user's answer before asking the next question. Do not assume or provide the user's answer yourself.

        3. Once you are confident in the identity of the character, OR after asking 20 questions, you must make a guess in the exact format:  
        "I guess your character is [Character Name]. Was I right?"
        
        4. Do not produce multiple questions at once. Do not recap previous questions or answers. Do not generate or assume future answers. Do not provide any filler text, explanations, or commentary. Simply produce the next single question or the guess. No other text is allowed.

        5. Do not summarize, restate, or refer to these instructions during the game. Simply comply silently.

        6. If at any point you are confident in the character, output the guess line as described above and nothing else.

        7. NEVER ask the question "Is the character 'X'?" You are not allowed to ask if it is a specific character. The only time you may mention the character is if you state it in the form "I guess your character is [Character name]. Was I right?"
        Example: *You think the character is the grinch*
        DO NOT ASK: "Is your character the grinch?". INSTEAD ASK: "Is your character hairy and green?"

        8. The game does not need to go to 20 questions. As previously stated, if you are confident in your guess before 20 questions have been asked, you may guess the character at any point.

        9. Understand that you have 20 questions to make a guess. Do not guess a character unless you are sure that it is them. If you have suspicions that it may be a character, ask a specific question before making your guess. Understand that this is a game, and if you guess wrong, you lose! So you want to be correct the first time. 
        For example: *You think the character is Jack Frost*
        ASK: Is your character extremely cold? (this way you have more reason to believe that the character is Jack Frost)
        
        10. DO NOT ask "Is your character fictional?". Because this is christmas-related characters, assume EVERY character is fictional.

        11. You have a tendency to not listen to the rules when you think the character is Mrs Claus. YOU ARE NOT ALLOWED TO ASK "Is your character Mrs. Claus?" YOU MUST phrase it "I guess your character is Mrs Claus. Was I right?"

        **BEGIN THE GAME NOW:**  
        Ask the first question in the correct format, and then wait for the user's response each turn before producing the next question or guess.`,
  },
];

// filler text type
interface ResponseType {
  text: string;
  fileName: string;
}

// Options for AI to respond with whilst thinking about next question
const fillers: ResponseType[] = [
  {
    text: "Interesting...",
    fileName: "interesting.wav",
  },
  {
    text: "Let's see...",
    fileName: "lets-see.wav",
  },
  {
    text: "Ok...",
    fileName: "OK.wav",
  },
  {
    text: "Let me think...",
    fileName: "let-me-think.wav",
  },
];

const responsesYes: ResponseType[] = [
  {
    text: "Yes! I knew it.",
    fileName: "yes-i-knew-it.wav",
  },
  {
    text: "Aha!",
    fileName: "aha.wav",
  },
  {
    text: "I was right!",
    fileName: "i-was-right.wav",
  },
  {
    text: "Of course!",
    fileName: "of-course.wav",
  },
];

const responsesNo: ResponseType[] = [
  {
    text: "I see.",
    fileName: "i-see.wav",
  },
  {
    text: "Got it.",
    fileName: "got-it.wav",
  },
  {
    text: "Alright.",
    fileName: "alright.wav",
  },
  {
    text: "Okay.",
    fileName: "OK.wav",
  },
];

export function GameBoard() {
  const maxQuestions = 21;

  const [selectedVoiceId, setSelectedVoiceId] = useState(
    "s3://voice-cloning-zero-shot/e5b701f9-5b39-4d4a-a0dc-254956f607c0/original/manifest.json",
  );
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(
    characters[0],
  );

  // Conversation logic
  const [conversation, setConversation] = useState<Message[]>(prompt);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Game states
  const [hasStarted, setHasStarted] = useState(false);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [playAgainFlag, setPlayAgainFlag] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  // AI response states
  const [aiResponse, setAiResponse] = useState("");
  const [showThinking, setShowThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState("");

  //  User response states
  const [lastUserResponse, setLastUserResponse] = useState("");

  // State to manage icon animation for volume icon
  const [isVolumeBouncing, setIsVolumeBouncing] = useState(false);

  // Function to Start the Game with Transition
  const startGame = () => {
    if (!selectedCharacter) return;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setShowTransition(true);
    setTimeout(() => {
      setHasStarted(true);
      setPlayAgainFlag(false);
      setCurrentQuestion(0);
      setConversation(prompt);
      setAiResponse("");
      getAiResponse(prompt);
    }, 500);
  };

  // ----- Handlers -----
  // 1. Select Character
  const handleCharacterSelect = (character: Character) => {
    console.log("Selecting character:", character);
    setSelectedCharacter(character);
    setSelectedVoiceId(character.voiceId || selectedVoiceId);
  };

  //   // 2. Start Game
  //   const startGame = async () => {
  //     if (!selectedCharacter) return;
  //     setHasStarted(true);
  //     setHasGuessed(false);
  //     setCurrentQuestion(1);
  //     setConversation(prompt);
  //     setAiResponse("");
  //     setShowPlayAgain(false);

  //     // Immediately request the first AI question
  //     await getAiResponse(prompt);
  //   };

  // 3. Fetch AI Response
  const fetchAiResponse = async (msgs: Message[]) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: msgs }),
      });
      const data: GuessResponse = await res.json();
      console.log("AI DATA: ", data);
      return data;
    } catch (error) {
      console.error("fetchAiResponse error", error);
      return { success: false, message: "", error: String(error) };
    }
  };

  // 4. Handle User Response (Yes/No/Sort Of/Not Sure)
  const handleUserResponse = async (res: string) => {
    // Add user's answer to the conversation
    const updatedConv: Message[] = [
      ...conversation,
      { role: "user", content: res },
    ];

    setLastUserResponse(res);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Now request AI's next question/guess
    await getAiResponse(updatedConv);
  };

  // 5. Request Next AI Question / Check Guess
  const getAiResponse = async (conv: Message[]) => {
    setShowThinking(true);
    const data = await fetchAiResponse(conv);

    if (!data.success) {
      setAiResponse("Something went wrong…");
      return;
    }

    const aiMsg = data.message || "";
    setAiResponse(aiMsg);

    // Push AI’s new message into conversation
    const newConv: Message[] = [...conv, { role: "assistant", content: aiMsg }];
    setConversation(newConv);
    setCurrentQuestion((q) => q + 1);

    // Check if AI guessed the character
    if (aiMsg.toLowerCase().startsWith("i guess your character is")) {
      setHasGuessed(true);
    } else {
      // If we've hit 21 questions without a guess, end the game
      if (currentQuestion >= maxQuestions) {
        setAiResponse("You stumped me! Try again?");
      }
    }

    // Play whatever the AI says
    if (!audioMuted) {
      await playText(aiMsg);
    }

    setShowThinking(false);
    setShowTransition(false);
  };

  // 6. Handle Guess Outcome
  const handleGuessOutcome = (correct: boolean) => {
    // If the guess was correct or not
    if (correct) {
      playAudio("voices/" + selectedCharacter.audioFolder + "/play-again.wav");
      if (selectedCharacter.audioFolder === "santa") {
        setAiResponse("Ho-ho-ho! I knew it! Want to play again?");
      } else if (selectedCharacter.audioFolder === "kevin") {
        setAiResponse("Yes! I win! Want to play again?");
      } else {
        setAiResponse("I knew I would get it. Do you want to play again?");
      }
    } else {
      playAudio("voices/" + selectedCharacter.audioFolder + "/stumped-me.wav");
      setAiResponse("You stumped me! Play again?");
    }
    setShowPlayAgain(true);
  };

  const handlePlayAgain = () => {
    setShowTransition(true);
    setTimeout(() => {
      setShowPlayAgain(false);
      setHasStarted(false);
      setHasGuessed(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setShowTransition(false);
    }, 500);
  };

  const getRandomPhrase = (responseText: string) => {
    if (responseText === "yes") {
      const response = responsesYes[Math.floor(Math.random() * 3)];

      // if we're not muted and the question is greater than 1
      if (currentQuestion != 0) {
        playAudio(
          "voices/" + selectedCharacter.audioFolder + "/" + response.fileName,
        );
      }
      return response.text;
    } else if (responseText === "no") {
      const response = responsesNo[Math.floor(Math.random() * 3)];
      // if we're not muted and the question is greater than 1
      if (currentQuestion != 0) {
        playAudio(
          "voices/" + selectedCharacter.audioFolder + "/" + response.fileName,
        );
      }
      return response.text;
    } else {
      const response = fillers[Math.floor(Math.random() * 3)];
      // if we're not muted and the question is greater than 1
      if (currentQuestion != 0) {
        playAudio(
          "voices/" + selectedCharacter.audioFolder + "/" + response.fileName,
        );
      }
      return response.text;
    }
  };

  // function to play audio only when not muted
  const playAudio = (source: string) => {
    if (!audioMuted) {
      new Audio("/audio/" + source).play();
    }
  };

  // Effect to handle the 5-second timeout
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isVolumeBouncing) {
      timer = setTimeout(() => {
        setIsVolumeBouncing(false);
      }, 5000); // 5 seconds - Santa sample is 5 seconds, others are 4
    }

    // Cleanup the timer if the component unmounts before the timeout
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVolumeBouncing]);

  // useEffect to handle calling random phrase function
  useEffect(() => {
    if (showThinking) {
      const phrase = getRandomPhrase(lastUserResponse.toLocaleLowerCase());
      setThinkingText(phrase);
    }
  }, [showThinking, lastUserResponse]);

  // Click handler for the button
  const handleSampleClick = () => {
    // Play the audio
    const audio = new Audio(selectedCharacter.audioSampleSrc);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });

    setIsVolumeBouncing(true);
  };

  // function to play the audio for each of the AI questions
  async function playText(text: string) {
    try {
      const response = await fetch(
        `/api/text-to-speech?text=${encodeURIComponent(text)}&voiceId=${encodeURIComponent(selectedVoiceId)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch audio");
      }
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  // ----- Rendering -----
  return (
    <div className="relative rounded-3xl border-8 border-red-500 p-2 md:p-4 md:m-10 min-h-[80vh] w-full max-w-4xl flex flex-col justify-evenly items-center overflow-hidden">
      {/** Background / Overlays */}
      {!hasStarted && <Snowfall />}
      <div className="absolute inset-0 bg-cover bg-center backdrop-blur-lg border-8 border-red-500 bg-[url('../blurry-xmas-bg.png')] filter blur"></div>
      <div className="absolute inset-0 bg-black bg-opacity-60 rounded-[16px]"></div>
      <AnimatePresence initial={false}>
        {showTransition ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 w-full h-full rounded-lg bg-red-500 z-50"
            key="box"
          />
        ) : null}
      </AnimatePresence>

      <div className="relative w-full p-4 md:p-10">
        {/** ----- HOME PAGE (Game not started) ----- */}
        {!hasStarted && !hasGuessed && (
          <div className="flex flex-col justify-center items-start">
            <div className="flex flex-row justify-between items-start">
              <h1 className="text-xl md:text-4xl mb-4 md:mb-10">
                Welcome to{" "}
                <span className="font-bold text-red-500">
                  The Adpharm's 21 Questions: Holiday Edition
                </span>
              </h1>
              {audioMuted && (
                <button
                  className="hover:scale-110 transition ease-in-out"
                  onClick={() => setAudioMuted(!audioMuted)}
                >
                  <VolumeX className="size-6" />
                </button>
              )}
              {!audioMuted && (
                <button
                  className="hover:scale-110 transition ease-in-out"
                  onClick={() => setAudioMuted(!audioMuted)}
                >
                  <Volume2 className="size-6" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:text-lg mb-4 md:mb-10">
              <p>
                Think of a character from any holiday movie, show, or book, and
                let our AI try to guess who's on your mind in 21 questions or
                fewer.
              </p>
              <p>
                For an extra festive twist, choose between Santa, Kevin
                McAllister, or The Grinch as your AI's voice.
              </p>
              <p>
                Will the AI unwrap your character's identity, or will it remain
                a holiday mystery? Let the merry guessing game begin!
              </p>
            </div>

            {/** Character Selection */}
            <div className="flex flex-col w-full justify-center items-center space-y-2">
              <div className="flex flex-row justify-center items-center space-x-2 mb-4 md:mb-12">
                {characters.map((character) => (
                  <button
                    key={character.name}
                    onClick={() => handleCharacterSelect(character)}
                    className={`transform transition ease-in-out`}
                  >
                    <img
                      src={character.source}
                      alt={character.name}
                      className="w-24 hover:scale-110 transition ease-in-out"
                    />
                  </button>
                ))}
              </div>

              {/** Showcase of Selected Character */}
              <div className="flex justify-center items-center translate-x-5 mb-10">
                <div className="relative flex items-center">
                  <div className="flex flex-row justify-center items-center bg-red-500 py-6 px-4 pl-14 md:pl-24 rounded-md shadow-lg">
                    <span className="text-white font-bold text-lg md:text-2xl font-christmas mr-4">
                      {selectedCharacter.name}
                    </span>
                    <button
                      onClick={handleSampleClick}
                      disabled={isVolumeBouncing}
                      className="cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Volume2
                        className={`transition-transform ${
                          isVolumeBouncing
                            ? "animate-slowBounce cursor-not-allowed"
                            : "hover:scale-110"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center transition ease-in-out">
                    <img
                      src={selectedCharacter.source}
                      alt={selectedCharacter.name}
                      className="h-24 md:h-44"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/** Start Game Button */}
            <div className="w-full text-center mt-10 md:mt-20">
              <button
                className="relative border border-transparent rounded-md px-6 py-4 bg-red-500 hover:bg-red-400 text-white font-christmas text-2xl md:text-4xl"
                onClick={() => startGame()}
              >
                <img
                  src="/santahat-btn.webp"
                  alt="Hat"
                  className="absolute
                    -top-[15px]
                    -left-[17px]
                    h-[44px]
                    drop-shadow-[0_2px_1px_rgba(0,0,0,0.25)]"
                />
                Start game
              </button>
            </div>
          </div>
        )}

        {/** ----- QUESTION/ANSWER PHASE (Game started, hasn't guessed yet) ----- */}
        {hasStarted && (
          <div className="w-full flex flex-col justify-center items-center">
            {/** Top controls */}
            <div className="flex flex-row justify-between items-center pb-6 w-full">
              <button className="hover:scale-110 transition ease-in-out ">
                <House className="size-8" onClick={() => handlePlayAgain()} />
              </button>
              {audioMuted && (
                <button
                  className="hover:scale-110 transition ease-in-out"
                  onClick={() => setAudioMuted(!audioMuted)}
                >
                  <VolumeX className="size-8" />
                </button>
              )}
              {!audioMuted && (
                <button
                  className="hover:scale-110 transition ease-in-out"
                  onClick={() => setAudioMuted(!audioMuted)}
                >
                  <Volume2 className="size-8" />
                </button>
              )}
            </div>
            {/** Speech Bubble */}
            <div
              className="relative bg-white text-black rounded-full px-4 md:px-6 py-2 md:py-4 md:max-w-lg mb-6 min-h-28 md:min-h-40 flex items-center justify-center
                after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:translate-y-2
                after:border-[10px] after:border-transparent after:border-t-white"
            >
              {/* Show "Thinking..." while loading, otherwise show the AI's response */}
              <p
                className={`text-center text-sm md:text-xl px-4 font-semibold transition ease-in-out font-speech break-words ${showThinking ? "animate-pulse" : ""}`}
              >
                {showThinking ? thinkingText : aiResponse}
              </p>
            </div>

            {/** Character Graphic */}
            <div className="flex flex-col justify-center items-center">
              <div className="relative w-64 h-64 md:w-72 md:h-72 flex flex-col justify-center items-center transition ease-in-out">
                <img
                  src={selectedCharacter.source}
                  alt={selectedCharacter.name}
                />
                <p className="font-christmas text-4xl text-red-500 mt-2">
                  {selectedCharacter.name}
                </p>
              </div>
            </div>

            {/** Question Count */}
            <div className="mt-14 md:mt-24 flex items-start justify-start w-full md:px-52 mb-4">
              {!hasGuessed && (
                <p className="text-white">
                  Question {currentQuestion} of {maxQuestions}
                </p>
              )}
            </div>

            {/** Yes/No/Sort Of/Not Sure buttons */}
            {!hasGuessed && (
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <button
                  disabled={showThinking}
                  onClick={() => handleUserResponse("Yes")}
                  className={`bg-green-700 rounded-xl w-full md:w-auto md:px-12 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out ${showThinking ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  Yes
                </button>
                <button
                  disabled={showThinking}
                  onClick={() => handleUserResponse("No")}
                  className={`bg-red-600 rounded-xl w-full md:w-auto md:px-12 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out ${showThinking ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  No
                </button>
                <button
                  disabled={showThinking}
                  onClick={() => handleUserResponse("Sort Of")}
                  className={`bg-amber-500 text-black rounded-xl w-full md:w-auto md:px-12 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out ${showThinking ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  Sort Of
                </button>
                <button
                  disabled={showThinking}
                  onClick={() => handleUserResponse("Not Sure")}
                  className={`bg-amber-500 text-black rounded-xl w-full md:w-auto md:px-12 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out ${showThinking ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  Not sure
                </button>
              </div>
            )}

            {/** AI has made a guess. Display Correct/Incorrect buttons */}
            {hasGuessed && !showPlayAgain && (
              <div className="mt-10 flex space-x-6 w-full justify-center items-center">
                <button
                  disabled={showThinking}
                  onClick={() => handleGuessOutcome(true)}
                  className={`bg-green-700 rounded-xl w-full max-w-44 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out ${showThinking ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Correct
                </button>
                <button
                  disabled={showThinking}
                  onClick={() => handleGuessOutcome(false)}
                  className={`bg-red-600 rounded-xl w-full max-w-44 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out ${showThinking ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Incorrect
                </button>
              </div>
            )}
          </div>
        )}
        {/** Ask the user if they want to play again! */}
        {showPlayAgain && (
          <div className="mt-10 flex space-x-6 w-full justify-center items-center">
            <button
              className="relative border border-transparent rounded-md px-6 py-4 bg-red-500 hover:bg-red-400 text-white font-christmas text-2xl md:text-4xl"
              onClick={() => handlePlayAgain()}
            >
              <img
                src="/santahat-btn.webp"
                alt="Hat"
                className="absolute
                    -top-[15px]
                    -left-[17px]
                    h-[44px]
                    drop-shadow-[0_2px_1px_rgba(0,0,0,0.25)]"
              />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameBoard;
