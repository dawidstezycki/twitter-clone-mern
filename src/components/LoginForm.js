import React from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ handleLogin }) => {
  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <div className="section">
        <div className="card-panel">
          <div className="section">
            <h4 className="center">Login</h4>
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-field">
              <i className="material-icons prefix">account_box</i>
              <input
                type="text"
                id="login"
                className="validate"
                name="login"
                required
              ></input>
              <label htmlFor="login">Username</label>
            </div>
            <div className="input-field">
              <i className="material-icons prefix">password</i>
              <input
                type="password"
                id="password"
                className="materialize-textarea"
                name="password"
                required
              ></input>
              <label htmlFor="password">Password</label>
            </div>
            <div className="right-align">
              <button className="btn waves-effect waves-light" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
        </div>
        <div className="section">
          <div className="center">
            <Link to="/registration">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
