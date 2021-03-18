import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navigation = ({ handleLogout }) => {
  const isUserLoggedIn = useSelector((state) => {
    return state.loggedUser ? true : false;
  });
  return (
    <nav>
      <div className="container nav-wrapper">
        <Link to="/" className="brand-logo left">
          Twitter
        </Link>
        <ul className="right">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li>{isUserLoggedIn ? 
            <a onClick={handleLogout}>Log out</a> : <Link to="/login">Log in</Link>
          }</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
