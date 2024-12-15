// import React, { useState } from 'react';
// import { motion } from 'framer-motion';

// interface FlipCardProps {
//   frontTitle?: string;
//   frontContent?: string;
//   backTitle?: string;
//   backContent?: string;
// }

// const FlipCard: React.FC<FlipCardProps> = ({
//   frontTitle = "This is the front side",
//   frontContent = "Click to flip!",
//   backTitle = "This is the back side",
//   backContent = "Click to flip back!"
// }) => {
//   const [isFlipped, setIsFlipped] = useState<boolean>(false);

//   const handleClick = (): void => {
//     setIsFlipped(!isFlipped);
//   };

//   return (
//     <div 
//       className="relative w-24 h-36 cursor-pointer perspective-1000" 
//       onClick={handleClick}
//     >
//       <motion.div
//         className="relative w-full h-full"
//         animate={{ rotateY: isFlipped ? 180 : 0 }}
//         transition={{ duration: 0.6, type: "tween" }}
//         style={{ transformStyle: "preserve-3d" }}
//       >
//         {/* }Front */}
//         <div className="absolute w-full h-full bg-blue-500 rounded-lg p-2 backface-hidden">
//           <div className="flex flex-col items-center justify-center h-full text-white">
//             {/* <h2 className="text-sm font-bold mb-2">{frontTitle}</h2>
//             <p className="text-center text-xs">{frontContent}</p> */}
//           </div>
//         </div>

//         {/* Back */}
//         <div 
//           className="absolute w-full h-full bg-red-500 rounded-lg p-2"
//           style={{ transform: "rotateY(180deg)" }}
//         >
//           <div className="flex flex-col items-center justify-center h-full text-white">
//             <h2 className="text-sm font-bold mb-2">{backTitle}</h2>
//             <p className="text-center text-xs">{backContent}</p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// const FlipCardGrid: React.FC = () => {
//   const cards = Array.from({ length: 16 }, (_, index) => (
//     <FlipCard key={index} />
//   ));

//   return (
//     <div className="grid grid-cols-4 gap-2">
//       {cards}
//     </div>
//   );
// };

// export default FlipCardGrid;


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FlipCardProps {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

const FlipCard: React.FC<FlipCardProps> = ({ content, isFlipped, isMatched, onClick }) => {
  const [flip, setFlip] = useState(true);

  return (
    <div
      className="relative w-24 h-36 cursor-pointer perspective-1000"
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "tween" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className={`absolute w-full h-full rounded-lg p-2 backface-hidden ${isMatched ? 'bg-green-500' : 'bg-blue-500'}`}>
          <div className="flex flex-col items-center justify-center h-full text-white">
          </div>
        </div>


        {/* Back */}
        <div
          className={`absolute w-full h-full rounded-lg p-2 ${isMatched ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="flex flex-col items-center justify-center h-full text-white">
            <p className="text-center text-sm font-bold">{content}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const MemoryGame: React.FC = () => {
  const cardContents = ['🌟', '🌙', '🌍', '☀️', '⭐', '🌪️', '🌈', '❄️'];
  const allCards = [...cardContents, ...cardContents];

  const [cards, setCards] = useState<Array<{ id: number; content: string; isFlipped: boolean; isMatched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);

  useEffect(() => {
    const shuffledCards = allCards
      .map((content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard?.content === secondCard?.content) {

        setCards(cards.map(card =>
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        ));
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
      } else {

        setTimeout(() => {
          setCards(cards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const handleCardClick = (id: number) => {
    const card = cards.find(c => c.id === id);

    // Do not flp if the card is already flipped or matched.
    if (card?.isMatched || card?.isFlipped || flippedCards.length === 2) return;

    setCards(cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards([...flippedCards, id]);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-lg font-bold mb-4">
        Matches Found: {matchedPairs} / {cardContents.length}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <FlipCard
            key={card.id}
            {...card}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
      {matchedPairs === cardContents.length && (
        <div className="text-xl font-bold text-green-500 mt-4">
          Congratulations! You've found all matches!
        </div>
      )}
    </div>
  );
};

export default MemoryGame;