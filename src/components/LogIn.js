import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const LogIn = (props) => {
  const wrapperRef = useRef("");
  const wrapperRefSignUp = useRef("");
  const [loginForm, setLogInForm] = useState(false);
  const [signUpForm, setSignUpForm] = useState(false);
  const [signUp, setSignUp] = useState({ username: "", email: "", password: "" });

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await Axios.post('https://sleepy-inlet-08384.herokuapp.com/api/users/register', signUp);
      if (data) {
        const data = await Axios.post('https://sleepy-inlet-08384.herokuapp.com/api/users/login', signUp);
        const currentUser = data.data.user;
        const currentToken = data.data.token;
        props.setUser(currentUser);
        props.setToken(currentToken);
        localStorage.clear();
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('token', currentToken);
      }
    } catch(err) {
      console.log(err);
    }
  }

  const onChangeSignUp = (e) => {
    setSignUp({
      ...signUp,
      [e.target.name]: e.target.value
    });
  }

  function useOutsideComponent(ref, deleteComponent) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setLogInForm(false);
                setSignUpForm(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);
  }
  useOutsideComponent(wrapperRef);
  useOutsideComponent(wrapperRefSignUp);

  const loginActivate = () => {
    setLogInForm(true);
  }
  const signUpActivate = () => {
    setSignUpForm(true);
  }
  
  return (
    <div className="login-buttons">
      <button className="login-btn" onClick={loginActivate}>Log In</button>
      <button className="signup-btn" onClick={signUpActivate}>Sign Up</button>
      {loginForm && <div ref={wrapperRef} className="login-form">
      <h3>Login</h3>
      <p>By continuing, you agree to our terms.</p>
      <form onSubmit={props.handleLoginSubmit}>
        <label>Email:</label>
        <input
          name="email"
          type="text"
          value={props.login.email}
          required
          onChange={props.onChangeLogin}
        />
        <label>Password:</label>
        <input
          name="password"
          type="password"
          value={props.login.password}
          required
          onChange={props.onChangeLogin}
        />
        <button>Submit</button>
      </form>
    </div>}

    {signUpForm && <div ref={wrapperRefSignUp} className="login-form">
      <h3>Sign Up</h3>
      <p>Join us and see the best of the internet!</p>
      <form onSubmit={handleSignUpSubmit}>
      <label>Username:</label>
        <input
          name="username"
          type="text"
          value={signUp.username}
          required
          onChange={onChangeSignUp}
        />
        <label>Email:</label>
        <input
          name="email"
          type="text"
          value={signUp.email}
          required
          onChange={onChangeSignUp}
        />
        <label>Password:</label>
        <input
          name="password"
          type="password"
          value={signUp.password}
          required
          onChange={onChangeSignUp}
        />
        <button>Submit</button>
      </form>
    </div>}
    </div>
  );
}

export default LogIn;