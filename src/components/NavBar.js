import React from 'react';
import LogIn from './LogIn';
import { Link } from "react-router-dom";
import './NavBar.css';
import HomeIcon from '@material-ui/icons/Home';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CredditLogo from '../images/creddit-icon.png';

const NavBar = (props) => {
  return (
    <nav className="navbar">
      <Link to="/"><div className="logo">
        <img className="creddit-logo" src={CredditLogo} alt="logo" />
        <h3 className="logo-text">Creddit</h3>
      </div></Link>
      <Link to="/"><HomeIcon /></Link>
      {props.user && <Link to="/create">Create Post</Link>}
      {props.user && <Link to="/" onClick={props.logOut}>Log Out</Link>}
      {!props.user && <LogIn 
        handleLoginSubmit={props.handleLoginSubmit}
        login={props.login}
        setUser={props.setUser}
        setToken={props.setToken}
        onChangeLogin={props.onChangeLogin}
      />}
    </nav>
  );
}

export default NavBar;