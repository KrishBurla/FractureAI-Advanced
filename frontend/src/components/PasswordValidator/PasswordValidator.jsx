import React from 'react';
import './PasswordValidator.css';

const ValidationItem = ({ isValid, text }) => (
  <li className={isValid ? 'valid' : 'invalid'}>
    <span className="icon">{isValid ? '✓' : '✗'}</span>
    {text}
  </li>
);

const PasswordValidator = ({ validations }) => {
  return (
    <ul className="password-validator">
      <ValidationItem isValid={validations.minLength} text="At least 8 characters" />
      <ValidationItem isValid={validations.hasUpper} text="One uppercase letter" />
      <ValidationItem isValid={validations.hasLower} text="One lowercase letter" />
      <ValidationItem isValid={validations.hasNumber} text="One number" />
      <ValidationItem isValid={validations.hasSpecial} text="One special character" />
    </ul>
  );
};

export default PasswordValidator;