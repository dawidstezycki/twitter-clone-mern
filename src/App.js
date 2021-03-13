import React, { useEffect } from 'react';
import Navigation from './components/Navigation';
import MicropostFeed from './components/MicropostFeed';
import Sidebar from './components/Sidebar';
import LoginForm from './components/LoginForm';
import { getMicroposts } from './reducers/micropostReducer';
import { setUser } from './reducers/userReducer';
import loginService from './services/login';
import micropostService from './services/microposts';
import { useDispatch, useSelector } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedTwitterUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      dispatch(setUser(loggedUser));
      micropostService.setToken(loggedUser.token);
    }
  }, []);

  useEffect(() => {
    dispatch(getMicroposts());
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        login: event.target.login.value,
        password: event.target.password.value,
      });
      window.localStorage.setItem(
        'loggedTwitterUser', JSON.stringify(user)
      )
      dispatch(setUser(user));
      micropostService.setToken(user.token);
    } catch (exception) {}
  };

  const handleLogout = async (event) => {
    window.localStorage.removeItem(
      'loggedTwitterUser'
    )
    dispatch(setUser(null));
    micropostService.setToken(null);
    
  };

  return (
    <div className="App">
      <Navigation handleLogout={handleLogout}/>
      <div className="container">
        {user ? (
          <div className="row">
            <Sidebar />
            <MicropostFeed />
          </div>
        ) : (
          <LoginForm handleLogin={handleLogin}/>
        )}
      </div>
    </div>
  );
};

export default App;
