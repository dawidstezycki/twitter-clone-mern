const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');

const Micropost = require('../components/micropost/micropostModel');
const User = require('../components/user/userModel');

const api = supertest(app);

beforeEach(async () => {
  await Micropost.deleteMany({});
  await User.deleteMany({});

  const userOne = await helper.addUserFromCredentials(helper.initialUsers[0]);
  const userTwo = await helper.addUserFromCredentials(helper.initialUsers[1]);

  const micropostCreationPromises = helper.initialMicroposts.map(
    async (post, index) => {
      const author = index % 2 ? userOne : userTwo;
      return helper.addMicropostAndAssignToUser(post, author.id);
    }
  );

  await Promise.all(micropostCreationPromises);
});

describe('GET /users', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  test('all users are returned', async () => {
    const response = await api.get('/api/users');
    expect(response.body.length).toBe(helper.initialUsers.length);
  });
  test('all users have correct username, email and microposts', async () => {
    const response = await api.get('/api/users');
    const usernames = response.body.map((user) => user.username);
    const email = response.body.map((user) => user.email);
    const micropostContentsArrays = response.body.map((user) =>
      user.microposts.map((post) => post.content)
    );

    helper.initialUsers.forEach((user) => {
      expect(usernames).toContain(user.username);
      expect(email).toContain(user.email);
    });

    expect(micropostContentsArrays.flat().sort()).toEqual(
      helper.initialMicroposts.map((post) => post.content).sort()
    );
  });
});

describe('GET /users/:id', () => {
  test('returns user sucessfully if valid id', async () => {
    const usersInDatabase = await helper.getUsersInDb();
    const validUser = usersInDatabase[0];

    const userReturned = await api
      .get(`/api/users/${validUser.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(userReturned.body.username).toEqual(validUser.username);
    expect(userReturned.body.email).toEqual(validUser.email);
    expect(userReturned.body.admin).toEqual(validUser.admin);
    expect(userReturned.body.id).toBe(validUser.id);

    const micropostsByUser = await helper.getMicropostsByUsername(validUser.username);
    expect(userReturned.body.microposts.map((post) => post.content)).toEqual(
      micropostsByUser.map((post) => post.content)
    );
  });

  test('fails with statuscode 404 if user does not exist', async () => {
    const nonExistingUserId = await helper.nonExistingUserId();

    await api.get(`/api/users/${nonExistingUserId}`).expect(404);
  });

  test('fails with statuscode 400 if invalid user id', async () => {
    const invalidId = 'asdlu12y938o2';

    await api.get(`/api/users/${invalidId}`).expect(400);
  });
});

describe('POST /users/', () => {
  test('creates user sucessfully if valid data', async () => {
    const newUser = {
      username: 'example',
      email: 'example@example.com',
      password: 'examplepassword',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAfterPostRequest = await helper.getUsersInDb();
    expect(usersAfterPostRequest.length).toBe(helper.initialUsers.length + 1);

    const usernames = usersAfterPostRequest.map((user) => user.username);
    const emails = usersAfterPostRequest.map((user) => user.email);
    expect(usernames).toContain(newUser.username);
    expect(emails).toContain(newUser.email);
  });

  test('fails with statuscode 400 if username too long', async () => {
    const newUser = {
      username: 'testingtestingtestingtestingtestingtestingtestingtesting',
      email: 'example@example.com',
      password: 'examplepassword',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with statuscode 400 if non-unique username', async () => {
    const newUser = {
      username: 'testing',
      email: 'example@example.com',
      password: 'examplepassword',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with statuscode 400 if invalid email', async () => {
    const newUser = {
      username: 'example',
      email: 'example@',
      password: 'examplepassword',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

describe('PUT /users/:id', () => {
  test('changes user data successfully if valid data and logged in as the user to be changed', async () => {
    const userToChange = await helper.getUserByAdminRights(false);
    const token = await helper.getUserTokenByUsername(userToChange.username);

    const userDataToChange = {
      username: 'changed',
      email: 'changed@changed.com',
    };

    await api
      .put(`/api/users/${userToChange.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(userDataToChange)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const userToChangeAfterPutRequest = await helper.getUserFromDbById(
      userToChange.id
    );

    expect(userToChangeAfterPutRequest.username).toBe(
      userDataToChange.username
    );
    expect(userToChangeAfterPutRequest.email).toBe(userDataToChange.email);
    expect(userToChangeAfterPutRequest.admin).toBe(false);
  });

  test('changes another user data successfully if valid data and logged in as admin', async () => {
    const userToChange = await helper.getUserByAdminRights(false);
    const userRequesting = await helper.getUserByAdminRights(true);
    const token = await helper.getUserTokenByUsername(userRequesting.username);

    const userDataToChange = {
      username: 'changed',
      email: 'changed@changed.com',
      admin: true,
    };

    await api
      .put(`/api/users/${userToChange.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(userDataToChange)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const userToChangeAfterPutRequest = await helper.getUserFromDbById(
      userToChange.id
    );

    expect(userToChangeAfterPutRequest.username).toBe(
      userDataToChange.username
    );
    expect(userToChangeAfterPutRequest.email).toBe(userDataToChange.email);
    expect(userToChangeAfterPutRequest.admin).toBe(userDataToChange.admin);
  });

  test('fails with status 401 if changing other data of another user without admin rights', async () => {
    const userToChange = await helper.getUserByAdminRights(true);
    const userRequesting = await helper.getUserByAdminRights(false);
    const token = await helper.getUserTokenByUsername(userRequesting.username);

    const userDataToChange = {
      username: 'changed',
      email: 'changed@changed.com',
    };

    await api
      .put(`/api/users/${userToChange.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(userDataToChange)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const userToChangeAfterPutRequest = await helper.getUserFromDbById(
      userToChange.id
    );

    expect(userToChangeAfterPutRequest.username).toBe(userToChange.username);
    expect(userToChangeAfterPutRequest.email).toBe(userToChange.email);
  });

  test('fails with status 401 if adding admin rights without admin rights', async () => {
    const userToChange = await helper.getUserByAdminRights(false);
    const token = await helper.getUserTokenByUsername(userToChange.username);

    const userDataToChange = {
      admin: true,
    };

    await api
      .put(`/api/users/${userToChange.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(userDataToChange)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const userToChangeAfterPutRequest = await helper.getUserFromDbById(
      userToChange.id
    );

    expect(userToChangeAfterPutRequest.admin).toBe(userToChange.admin);
  });

  test('fails with statuscode 404 if user does not exist', async () => {
    const userRequesting = await helper.getUserByAdminRights(true);
    const token = await helper.getUserTokenByUsername(userRequesting.username);
    const nonExistingUserId = await helper.nonExistingUserId();

    const userDataToChange = {
      username: 'changed',
      email: 'changed@changed.com',
    };

    await api
      .put(`/api/users/${nonExistingUserId}`)
      .set('Authorization', `bearer ${token}`)
      .send(userDataToChange)
      .expect(404);
  });

  test('fails with statuscode 400 if invalid user id', async () => {
    const userRequesting = await helper.getUserByAdminRights(true);
    const token = await helper.getUserTokenByUsername(userRequesting.username);
    const invalidId = 'asdlu12y938o2';
    const userDataToChange = {
      username: 'changed',
      email: 'changed@changed.com',
    };

    await api
      .put(`/api/users/${invalidId}`)
      .set('Authorization', `bearer ${token}`)
      .send(userDataToChange)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
