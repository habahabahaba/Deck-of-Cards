// React:
// PropTypes:
import PropTypes from 'prop-types';

export default function ToggleField({ text, handler, ...rest }) {
  return (
    <div className='toggle-field' {...rest}>
      <label htmlFor='animation'>{text}</label>
      <label className='toggle'>
        <input
          type='checkbox'
          id='animation'
          onChange={(e) => {
            handler(e);
          }}
        />
        <span className='slider' />
      </label>
    </div>
  );
}

ToggleField.propTypes = {
  text: PropTypes.string,
  handler: PropTypes.func,
};
