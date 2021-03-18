import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import ProfilePage from './components/ProfilePage';
import UsersPage from './components/UsersPage';
import Navigation from './components/Navigation';
import loginService from './services/login';
import micropostService from './services/microposts';
import userService from './services/users';
import relationshipService from './services/relationships';
import { setLoggedUser } from './reducers/loggedUserReducer';
import { getLoggedUserRelationships } from './reducers/loggedUserRelationshipReducer';

const App = () => {
  const loggedUser = useSelector((state) => state.loggedUser);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedTwitterUser');
    if (loggedUserJSON) {
      const loggedUserParsed = JSON.parse(loggedUserJSON);
      dispatch(setLoggedUser(loggedUserParsed));
      micropostService.setToken(loggedUserParsed.token);
      userService.setToken(loggedUserParsed.token);
      relationshipService.setToken(loggedUserParsed.token);
    }
  }, [dispatch]);

  useEffect(() => {
    if (loggedUser) {
      dispatch(getLoggedUserRelationships(loggedUser.id));
    }
  }, [loggedUser, dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({
        login: event.target.login.value,
        password: event.target.password.value,
      });
      window.localStorage.setItem('loggedTwitterUser', JSON.stringify(loggedUser));
      dispatch(setLoggedUser(loggedUser));
      micropostService.setToken(loggedUser.token);
      userService.setToken(loggedUser.token);
      relationshipService.setToken(loggedUser.token);
      history.push('/');
    } catch (exception) {}
  };

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedTwitterUser');
    dispatch(setLoggedUser(null));
    micropostService.setToken(null);
    userService.setToken(null);
    relationshipService.setToken(null);
  };

  return (
    <div className="App">
      <Navigation handleLogout={handleLogout} />
      <Switch>
        <Route path="/users/:id">
        {window.localStorage.getItem('loggedTwitterUser') ? <ProfilePage/> : <Redirect to="/login" />}
        </Route>
        <Route path="/users">
        {window.localStorage.getItem('loggedTwitterUser') ? <UsersPage /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          <LoginPage handleLogin={handleLogin} />
        </Route>
        <Route path="/registration">
        {window.localStorage.getItem('loggedTwitterUser') ? <Redirect to="/" /> : <RegistrationPage/>}
        </Route>
        <Route path="/">
        {window.localStorage.getItem('loggedTwitterUser') ? <HomePage /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </div>
  );
};

export default App;
