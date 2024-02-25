// React:
import { useState, useCallback } from 'react';
// Context:
import cardsApiContext from './cardsApiContext';
// PropTypes:
import PropTypes from 'prop-types';

const BASE_URL = 'https://deckofcardsapi.com/api/deck';
const SVG_BASE_URL = 'https://deckofcardsapi.com/static/img';

const cachedImages = {};

export default function CardsApiProvider({ children }) {
  const [deckId, setDeckId] = useState(null);
  const [loadedCards, setLoadedCards] = useState([]);
  const getCardSVG = useCallback(fetchCardSVG, []);
  const getNewDeck = useCallback(fetchNewDeck, []);
  const getOneCard = useCallback(fetchOneCard, [getCardSVG]);
  const getNCards = useCallback(fetchNCards, [getCardSVG]);
  const getReshuffledDeck = useCallback(fetchReshuffledDeck, [deckId]);

  // Fetch a new deck-id:
  async function fetchNewDeck() {
    const res = await fetch(`${BASE_URL}/new/shuffle`);
    if (!res.ok) {
      throw new Error('Failed to load a new deck!');
    } else {
      const data = await res.json();
      const deckId = data.deck_id;
      console.log('fetchNewDeck deckId:', deckId);
      setDeckId(deckId);
      return deckId;
    }
  }

  // Fetch re-shuffled deck
  async function fetchReshuffledDeck() {
    const res = await fetch(`${BASE_URL}/${deckId}/shuffle/`);
    if (!res.ok) {
      throw new Error('Failed to shuffle the deck!');
    } else return deckId;
  }

  // Fetch and cache card SVG:
  async function fetchCardSVG(code) {
    // console.log('fetchCardSVG cachedImages:', cachedImages);
    if (cachedImages[code]) {
      console.log('fetchCardSVG FROM CACHE!');
      return code;
    }

    const svgRes = await fetch(`${SVG_BASE_URL}/${code}.svg`);
    if (!svgRes.ok) {
      throw new Error(`Failed to load an svg image for the ${code} card!`);
    }
    const svgText = await svgRes.text();
    // Convert to base64:
    const base64Data = btoa(svgText);
    const svgURL = `data:image/svg+xml;base64,${base64Data}`;

    // Put to cache:
    cachedImages[code] = svgURL;

    // return svgURL;
    return code;
  }

  // Fetch multiple cards:
  async function fetchNCards(num, deckId) {
    const res = await fetch(`${BASE_URL}/${deckId}/draw/?count=${num}`);
    if (!res.ok) {
      throw new Error('Failed to load a cards from the deck!');
    }
    const data = await res.json();
    const rawCards = data.cards;

    // add SVG's to cards:
    const fetchedSVGs = await Promise.all(
      rawCards.map(({ code }) => getCardSVG(code))
    );
    console.log('fetchNCards fetchedSVGs:', fetchedSVGs);

    const newCards = await Promise.all(
      rawCards.map(async ({ suit, value }, i) => {
        return {
          deckId: data.deck_id,
          code: fetchedSVGs[i],
          suit,
          value,
          // image: fetchedSVGs[i],
          // image: cachedImages[code],
          // image: crd.images.svg,
          rotation: 0,
          offset: [0, 0],
        };
      })
    );

    console.log('fetchNCards newCards:', newCards);
    return newCards;
  }

  // Fetch one card:
  async function fetchOneCard(deckId) {
    const res = await fetch(`${BASE_URL}/${deckId}/draw`);
    if (!res.ok) {
      throw new Error('Failed to load a card from the deck!');
    }
    const data = await res.json();
    const crd = data.cards[0];

    const fetchedSVGcode = await getCardSVG(crd.code);

    const card = {
      deckId: data.deck_id,
      // code: crd.code,
      code: await fetchedSVGcode,
      value: crd.value,
      suit: crd.suit,

      rotation: 0,
      offset: [0, 0],
    };
    console.log('fetchOneCard data:', card);

    return card;
  }

  //   console.log('from ctx, deckId:', deckId);
  const contextValue = {
    getNewDeck,
    getOneCard,
    getNCards,
    getReshuffledDeck,
    deckId,
    cachedImages,
    loadedCards,
    setLoadedCards,
  };

  return (
    <cardsApiContext.Provider value={contextValue}>
      {children}
    </cardsApiContext.Provider>
  );
}

CardsApiProvider.propTypes = {
  children: PropTypes.element,
};
