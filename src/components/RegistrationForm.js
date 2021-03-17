import React from 'react';

const RegistrationForm = ({ handleRegistration }) => {
  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <div className="card-panel">
          <div className="section">
            <h4 className="center">Registration</h4>
          </div>
          <form onSubmit={handleRegistration}>
            <div className="input-field">
              <i className="material-icons prefix">account_box</i>
              <input
                type="text"
                id="username"
                className="validate"
                name="username"
                required
              ></input>
              <label htmlFor="username">Username</label>
            </div>
            <div className="input-field">
              <i className="material-icons prefix">mail</i>
              <input
                type="text"
                id="email"
                className="validate"
                name="email"
                required
              ></input>
              <label htmlFor="email">E-mail</label>
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
              <button className="btn waves-effect waves-light " type="submit">
                Register Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
