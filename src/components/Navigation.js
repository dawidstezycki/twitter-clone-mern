import React from 'react';
import { useSelector } from 'react-redux';

const Navigation = ({handleLogout}) => {
  const isUserLoggedIn = useSelector((state) => {
    return state.user ? true : false;
  });
  return (
    <nav>
      <div className="container nav-wrapper">
        <a href="#" className="brand-logo left">
          Twitter
        </a>
        <ul className="right">
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Users</a>
          </li>
          {isUserLoggedIn && (
            <li>
              <a onClick={handleLogout}>Log out</a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
