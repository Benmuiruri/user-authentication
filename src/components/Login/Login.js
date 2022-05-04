// @ts-ignore
import React, { useState, useEffect, useReducer, useContext } from 'react';
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
  switch (action.type) {
    case 'USER_EMAIL':
      return { value: action.payload, isValid: action.payload.includes('@') };
    case 'INPUT_BLUR':
      return { value: state.value, isValid: state.value.includes('@') };
    default:
      return { value: '', isValid: false };
  }
};

const passwordReducer = (state, action) => {
  switch (action.type) {
    case 'USER_PASSWORD':
      return {
        value: action.payload,
        isValid: action.payload.trim().length > 6,
      };
    case 'INPUT_BLUR':
      return { value: state.value, isValid: state.value.trim().length > 6 };

    default:
      return { value: '', isValid: false };
  }
};

const Login = (props) => {
  const authCtx = useContext(AuthContext);
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      //runs once when component loads, then 500 miliseconds it updates the formisValid state based on email and password validity.
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // @ts-ignore
    dispatchEmail({ type: 'USER_EMAIL', payload: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    // @ts-ignore
    dispatchPassword({ type: 'USER_PASSWORD', payload: event.target.value });
  };

  const validateEmailHandler = () => {
    // @ts-ignore
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    // @ts-ignore
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id='email'
          label='E-Mail'
          type='email'
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          id='password'
          label='password'
          type='password'
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
