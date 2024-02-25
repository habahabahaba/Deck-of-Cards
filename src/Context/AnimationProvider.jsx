// React:
import { useState } from 'react';
// Context:
import animationContext from './animationContext';
// PropTypes:
import PropTypes from 'prop-types';

export default function AnimationProvider({ children }) {
  const [animate, setAnimate] = useState(false);

  const contextValue = { animate, setAnimate };
  return (
    <animationContext.Provider value={contextValue}>
      {children}
    </animationContext.Provider>
  );
}

AnimationProvider.propTypes = { children: PropTypes.element };
