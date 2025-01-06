import { Volume2 } from "lucide-react";
import { useState } from "react";
import Snowfall from "./Snowfall";

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
}

const characters: Character[] = [
  {
    name: "Santa Claus",
    source: "/santa.webp",
    voiceId: "voice_elara_001",
  },
  {
    name: "Kevin McCallister",
    source: "/kevin.webp",
    voiceId: "voice_lyra_003",
  },
  {
    name: "The Grinch",
    source: "/grinch.webp",
    voiceId: "",
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

        **BEGIN THE GAME NOW:**  
        Ask the first question in the correct format, and then wait for the user's response each turn before producing the next question or guess.`,
  },
];

// Options for AI to respond with whilst thinking about next question
const fillers = ["Hmm...", "Let's see...", "Ok...", "Let me think..."];
const responsesYes = ["Yes! I knew it.", "Aha!", "I was right!", "Of course!"];
const responsesNo = ["I see.", "Got it.", "Alright.", "Okay."];

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
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);

  // AI response states
  const [aiResponse, setAiResponse] = useState("");
  const [showThinking, setShowThinking] = useState(false);

  //  User response states
  const [lastUserResponse, setLastUserResponse] = useState("");

  // Function to Start the Game with Transition
  const startGame = () => {
    if (!selectedCharacter) return;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setHasStarted(true);
    setPlayAgainFlag(false);
    setCurrentQuestion(0);
    setConversation(prompt);
    setAiResponse("");
    getAiResponse(prompt);
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
    setShowThinking(false);

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
  };

  // 6. Handle Guess Outcome
  const handleGuessOutcome = (correct: boolean) => {
    // If the guess was correct or not
    if (correct) {
      setAiResponse("Ho-ho-ho! I knew it! Play again?");
    } else {
      setAiResponse("You stumped me! Play again?");
    }
    setShowPlayAgain(true);
  };

  const handlePlayAgain = () => {
    setShowPlayAgain(false);
    setHasStarted(false);
    setHasGuessed(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getRandomPhrase = (responseText: string) => {
    if (responseText === "yes") {
      return responsesYes[Math.floor(Math.random() * 3)];
    } else if (responseText === "no") {
      return responsesNo[Math.floor(Math.random() * 3)];
    } else {
      return fillers[Math.floor(Math.random() * 3)];
    }
  };

  // ----- Rendering -----
  return (
    <div className="relative rounded-3xl border-8 border-red-500 p-2 md:p-4 md:m-10 min-h-[80vh] w-full max-w-4xl flex flex-col justify-evenly items-center overflow-hidden">
      {/** Background / Overlays */}
      {!hasStarted && <Snowfall />}
      <div className="absolute inset-0 bg-cover bg-center backdrop-blur-lg border-8 border-red-500 bg-[url('../blurry-xmas-bg.png')] filter blur"></div>
      <div className="absolute inset-0 bg-black bg-opacity-60 rounded-[16px]"></div>

      <div className="relative w-full p-4 md:p-10">
        {/** ----- HOME PAGE (Game not started) ----- */}
        {!hasStarted && !hasGuessed && (
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-xl md:text-4xl mb-4 md:mb-10">
              Welcome to{" "}
              <span className="font-bold text-red-500">
                The Adpharm's 21 Questions: Holiday Edition
              </span>
            </h1>

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
              <div className="flex justify-center items-center translate-x-6 mb-10">
                <div className="relative flex items-center">
                  <div className="flex flex-row justify-center items-center bg-red-500 py-6 px-4 pl-14 md:pl-24 rounded-md shadow-lg">
                    <span className="text-white font-bold text-lg md:text-2xl font-christmas mr-4">
                      {selectedCharacter.name}
                    </span>
                    <Volume2 className="cursor-pointer hover:scale-110" />
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
          <div className="w-full flex flex-col justify-center items-center pt-6">
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
                {showThinking
                  ? getRandomPhrase(lastUserResponse.toLocaleLowerCase())
                  : aiResponse}
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
                  onClick={() => handleUserResponse("Yes")}
                  className="bg-green-700 rounded-xl w-full md:w-auto md:px-12 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleUserResponse("No")}
                  className="bg-red-600 rounded-xl w-full md:w-auto md:px-12 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out"
                >
                  No
                </button>
                <button
                  onClick={() => handleUserResponse("Sort Of")}
                  className="bg-amber-500 text-black rounded-xl w-full md:w-auto md:px-12 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out"
                >
                  Sort Of
                </button>
                <button
                  onClick={() => handleUserResponse("Not Sure")}
                  className="bg-amber-500 text-black rounded-xl w-full md:w-auto md:px-12 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out"
                >
                  Not sure
                </button>
              </div>
            )}

            {/** AI has made a guess. Display Correct/Incorrect buttons */}
            {hasGuessed && !showPlayAgain && (
              <div className="mt-10 flex space-x-6 w-full justify-center items-center">
                <button
                  onClick={() => handleGuessOutcome(true)}
                  className="bg-green-700 rounded-xl w-full max-w-44 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out"
                >
                  Correct
                </button>
                <button
                  onClick={() => handleGuessOutcome(false)}
                  className="bg-red-600 rounded-xl w-full max-w-44 py-4 text-2xl font-christmas hover:scale-105 border-2 border-white transition ease-in-out"
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
