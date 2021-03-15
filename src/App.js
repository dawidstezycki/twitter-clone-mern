import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import UsersPage from './components/UsersPage';
import Navigation from './components/Navigation';
import loginService from './services/login';
import micropostService from './services/microposts';
import userService from './services/users';
import relationshipService from './services/relationships';
import { setUser } from './reducers/userReducer';
import { getUserRelationships } from './reducers/relationshipReducer';

const App = () => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedTwitterUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      dispatch(setUser(loggedUser));
      micropostService.setToken(loggedUser.token);
      userService.setToken(loggedUser.token);
      relationshipService.setToken(loggedUser.token);
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getUserRelationships(user.id));
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        login: event.target.login.value,
        password: event.target.password.value,
      });
      window.localStorage.setItem('loggedTwitterUser', JSON.stringify(user));
      dispatch(setUser(user));
      micropostService.setToken(user.token);
      userService.setToken(user.token);
      relationshipService.setToken(user.token);
      history.push('/');
    } catch (exception) {}
  };

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedTwitterUser');
    dispatch(setUser(null));
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
        <Route path="/">
        {window.localStorage.getItem('loggedTwitterUser') ? <HomePage /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </div>
  );
};

export default App;
