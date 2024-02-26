// React:
import { useState, useContext, useEffect } from 'react';
//  Context:
import cardsApiContext from './Context/cardsApiContext';
import animationContext from './Context/animationContext';
// Components:
import Button from './Components/UI/Button';
import ToggleField from './Components/UI/ToggleField';
import Card from './Components/UI/Card';
// Images:
import backURL from './assets/back.png';
//CSS:
import './App.css';

function App() {
  const [drawnCards, setDrawnCards] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const {
    getNewDeck,
    getNCards,
    getReshuffledDeck,
    deckId,
    loadedCards,
    setLoadedCards,
    cachedImages,
  } = useContext(cardsApiContext);
  const { setAnimate } = useContext(animationContext);

  // Preloading card back image:
  useEffect(() => {
    const backImg = new Image();
    backImg.src = backURL;
  }, []);

  // Get deck id and pre-load 13 cards;
  useEffect(() => {
    getNewDeck()
      .then((id) => getNCards(13, id))
      .then((newCards) => {
        console.log('app newCards:', newCards);
        setLoadedCards(newCards);
      })
      .finally(() => {
        setIsloading(false);
      });
    return () => {
      setIsloading(false);
    };
  }, [getNewDeck, getNCards, setLoadedCards]);

  // Wait for cards to preload:
  useEffect(() => {
    const cardsDrawn = drawnCards.length;
    if (cardsDrawn < 50 && cardsDrawn >= loadedCards.length - 2) {
      setIsloading(true);
    }
    return () => {
      setIsloading(false);
    };
  }, [drawnCards, loadedCards]);

  function random(offset, multiplier) {
    return Math.round((Math.random() + offset) * multiplier);
  }

  async function handleDrawOneCard() {
    // console.log('App handler id:', deckId);
    // console.log('app cachedImages:', cachedImages);

    if (!deckId) return;
    const cardsDrawn = drawnCards.length;
    if (cardsDrawn === loadedCards.length - 7 && cardsDrawn !== 45) {
      getNCards(13, deckId).then((newCards) => {
        console.log('app new fetch newCards:', newCards);
        setLoadedCards((cards) => [...cards, ...newCards]);
      });
    }

    const newCard = loadedCards[cardsDrawn];

    const angle = random(-0.5, 110);
    const offset = [random(0, 10), random(0, 10)];
    newCard.rotation = angle;
    newCard.offset = offset;
    setDrawnCards((cards) => [...cards, newCard]);
  }

  async function handleReshuffleDeck() {
    setDrawnCards([]);
    setIsloading(true);
    setLoadedCards([]);

    // Re-shuffle existing deck:
    getReshuffledDeck()
      .then((res) => {
        if (res) return getNCards(13, deckId);
      })
      .then((newCards) => {
        console.log('app newCards:', newCards);
        setLoadedCards((cards) => [...cards, ...newCards]);
      })
      .finally(() => {
        setIsloading(false);
      });

    //  Get new deck:
    // getNewDeck()
    //   .then((id) => getNCards(13, id))
    //   .then((newCards) => {
    //     console.log('app newCards:', newCards);
    //     setLoadedCards((cards) => [...cards, ...newCards]);
    //   })
    //   .finally(() => {
    //     setIsloading(false);
    //   });
  }

  function handleToggleAnimation(evt) {
    console.log('toggle EVENT:', evt);
    setAnimate(evt.target.checked);
  }

  const pile = drawnCards.length
    ? drawnCards.map(({ deckId, code, suit, value, rotation, offset }, idx) => (
        <Card
          rotation={rotation}
          offset={offset}
          faceURL={cachedImages[code]}
          backURL={backURL}
          suit={suit}
          value={value}
          zIndex={idx + 1}
          key={deckId + '-' + idx}
        />
      ))
    : null;

  return (
    <>
      <div className='table'>
        {drawnCards.length < 52 ? (
          <Button
            text='Draw one card'
            handler={handleDrawOneCard}
            disabled={isLoading ? true : false}
            className='button draw'
          />
        ) : (
          <Button
            text='Shuffle deck'
            handler={handleReshuffleDeck}
            className='button draw'
          />
        )}
        <ToggleField text='Animation ' handler={handleToggleAnimation} />
        <div className='loading'>
          {isLoading ? <span>Loading cards...</span> : <span />}
        </div>
        {drawnCards.length ? pile : null}
        <div className='status'>
          <span>{`# preloaded cards: ${loadedCards.length}`}</span>
          <span>{`# cached images: ${Object.keys(cachedImages).length}`}</span>
          <span>{`# cards dealt: ${drawnCards.length}`}</span>
          <span>{`# cards left: ${52 - drawnCards.length}`}</span>
        </div>
      </div>
    </>
  );
}

export default App;
