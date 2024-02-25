// React:
import { useEffect, useState, useContext } from 'react';
// Context:
import animationContext from '../../Context/animationContext';
// PropTypes:
import PropTypes from 'prop-types';

export default function Card({
  suit,
  value,
  backURL,
  faceURL,
  offset,
  rotation,
  zIndex,
}) {
  const { animate } = useContext(animationContext);
  const [faceUp, setFaceUp] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  //   console.log('from Card, image:', image);

  useEffect(() => {
    if (animate) {
      setTimeout(() => {
        setFirstRender(false);
      }, 1951);
      setTimeout(() => {
        setFaceUp(true);
      }, 950);
    } else {
      setFaceUp(true);
      setFirstRender(false);
    }
  }, []);
  useEffect(() => {
    if (!animate) setFirstRender(false);
  }, [animate]);

  const [x, y] = offset;

  const back = (
    <div
      alt={`${value} of ${suit} card`}
      className='card back'
      style={{
        zIndex: `${zIndex}`,
        backgroundImage: `url(${backURL})`,
      }}
    />
  );

  const face = (
    <div
      alt={`${value} of ${suit} card`}
      className={`card face ${animate && firstRender ? 'animated' : null}`}
      style={{
        transform: `rotate(${rotation}deg) rotateY(0deg) translate(${x}%, ${y}% )`,
        zIndex: `${zIndex}`,
        backgroundImage: `url(${faceURL})`,
      }}
    />
  );

  return (
    <>
      {animate && !faceUp && back}
      {faceUp && face}
    </>
  );
}

Card.propTypes = {
  suit: PropTypes.string,
  value: PropTypes.string,
  backURL: PropTypes.string,
  faceURL: PropTypes.string,
  offset: PropTypes.arrayOf(PropTypes.number),
  rotation: PropTypes.number,
  zIndex: PropTypes.number,
};
