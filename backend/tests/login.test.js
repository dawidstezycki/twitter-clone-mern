const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const jwt = require('jsonwebtoken');

const User = require('../components/user/userModel');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const userCreationPromises = helper.initialUsers.map(
    async (userCredentials) => helper.addUserFromCredentials(userCredentials)
  );

  await Promise.all(userCreationPromises);
});

describe('POST /login', () => {
  test('token and credentials are returned as json', async () => {
    const loginCredentials = {
      login: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password,
    };
    await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returns token successfully when correct username and password', async () => {
    const loginCredentials = {
      login: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password,
    };

    const loggedUser = await helper.getUserByUsername(
      helper.initialUsers[0].username
    );

    const response = await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.username).toBe(helper.initialUsers[0].username);
    expect(response.body.email).toBe(helper.initialUsers[0].email);
    expect(response.body.id).toBe(loggedUser.id);

    const decodedToken = jwt.verify(response.body.token, process.env.SECRET);
    expect(decodedToken.username).toBe(helper.initialUsers[0].username);
    expect(decodedToken.id).toBe(loggedUser.id);
  });

  test('returns token successfully when correct email and password', async () => {
    const loginCredentials = {
      login: helper.initialUsers[0].email,
      password: helper.initialUsers[0].password,
    };

    const loggedUser = await helper.getUserByUsername(
      helper.initialUsers[0].username
    );

    const response = await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.username).toBe(helper.initialUsers[0].username);
    expect(response.body.email).toBe(helper.initialUsers[0].email);
    expect(response.body.id).toBe(loggedUser.id);

    const decodedToken = jwt.verify(response.body.token, process.env.SECRET);
    expect(decodedToken.username).toBe(helper.initialUsers[0].username);
    expect(decodedToken.id).toBe(loggedUser.id);
  });

  test('fails with statuscode 401 when correct login and incorrect password', async () => {
    const loginCredentials = {
      login: helper.initialUsers[0].email,
      password: "wrongpassword",
    };

    await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with statuscode 401 when nonexisting login', async () => {
    const loginCredentials = {
      login: "nonexisting",
      password: "nonexistingpassword",
    };

    await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });
});


afterAll(() => {
  mongoose.connection.close();
});
