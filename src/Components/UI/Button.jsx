// PropTypes:
import PropTypes from 'prop-types';

export default function Button({ text, handler, disabled, children, ...rest }) {
  return (
    <button
      onClick={() => {
        if (!disabled) handler();
      }}
      style={{ opacity: `${disabled ? '0.5' : '1'}` }}
      {...rest}
    >
      {children}
      <span>{text}</span>
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string,
  handler: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.element,
};
