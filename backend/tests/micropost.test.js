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

  const userCreationPromises = helper.initialUsers.map(
    async (userCredentials) => helper.addUserFromCredentials(userCredentials)
  );

  await Promise.all(userCreationPromises);

  const micropostCreationPromises = helper.initialMicroposts.map(
    async (post) => {
      const author = await helper.getUserByUsername(post.username);
      return helper.addMicropostAndAssignToUser(post, author.id);
    }
  );

  await Promise.all(micropostCreationPromises);
});

describe('GET /microposts', () => {
  test('microposts are returned as json', async () => {
    await api
      .get('/api/microposts')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  test('all microposts are returned', async () => {
    const response = await api.get('/api/microposts');
    expect(response.body.length).toBe(helper.initialMicroposts.length);
  });
  test('all microposts contain correct contents', async () => {
    const response = await api.get('/api/microposts');
    const contents = response.body.map((post) => post.content);
    helper.initialMicroposts.forEach((initialMicropost) => {
      expect(contents).toContain(initialMicropost.content);
    });
  });
});

describe('GET /microposts/:id', () => {
  test('returns micropost sucessfully if valid id', async () => {
    const micropostsInDatabase = await helper.getMicropostsInDb();
    const validMicropost = micropostsInDatabase[0];
    const validMicropostUser = await helper.getUserFromDbById(
      validMicropost.user
    );

    const micropostReturned = await api
      .get(`/api/microposts/${validMicropost.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(micropostReturned.body.content).toEqual(validMicropost.content);
    expect(micropostReturned.body.date).toEqual(
      validMicropost.date.toISOString()
    );
    expect(micropostReturned.body.user.id).toEqual(validMicropostUser.id);
    expect(micropostReturned.body.user.username).toEqual(
      validMicropostUser.username
    );
  });

  test('fails with statuscode 404 if micropost does not exist', async () => {
    const nonExistingMicropostId = await helper.nonExistingMicropostId();

    await api.get(`/api/microposts/${nonExistingMicropostId}`).expect(404);
  });

  test('fails with statuscode 400 if invalid micropost id', async () => {
    const invalidId = 'asdlu12y938o2';

    await api.get(`/api/microposts/${invalidId}`).expect(400);
  });
});

describe('POST /microposts/', () => {
  describe('when authorized', () => {
    let token;

    beforeEach(async () => {
      const userPosting = helper.initialUsers[0];
      token = await helper.getUserTokenByUsername(userPosting.username);
    });

    test('creates micropost sucessfully if valid data', async () => {
      const newMicropost = {
        content: "Let's test adding microposts",
      };

      await api
        .post('/api/microposts')
        .set('Authorization', `bearer ${token}`)
        .send(newMicropost)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const micropostsAfterPostRequest = await helper.getMicropostsInDb();
      expect(micropostsAfterPostRequest.length).toBe(
        helper.initialMicroposts.length + 1
      );

      const micropostsContents = micropostsAfterPostRequest.map(
        (micropost) => micropost.content
      );
      expect(micropostsContents).toContain(newMicropost.content);
    });

    test('fails with statuscode 400 if invalid data', async () => {
      const newMicropost = {};

      await api
        .post('/api/microposts')
        .set('Authorization', `bearer ${token}`)
        .send(newMicropost)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });
  });
  describe('when not authorized', () => {
    test('fails with 401 status if invalid token', async () => {
      const newMicropost = {
        content: "Let's test adding microposts",
      };

      await api
        .post('/api/microposts')
        .set('Authorization', 'asd182d9012h8d0saj0d9182')
        .send(newMicropost)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    });
  });
});

describe('DELETE /microposts/:id', () => {
  let userNonAdmin;
  let userAdmin;

  beforeEach(async () => {
    userNonAdmin = await helper.getUserByAdminRights(false);
    userAdmin = await helper.getUserByAdminRights(true);
  });

  test('deletes micropost sucessfully if valid id and logged in as non-admin author', async () => {
    const token = await helper.getUserTokenByUsername(userNonAdmin.username);

    const micropostsBeforeDeleteRequest = await helper.getMicropostsInDb();
    const micropostsByLoggedUser = await helper.getMicropostsByUsername(
      userNonAdmin.username
    );
    const micropostToDelete = micropostsByLoggedUser[0];

    await api
      .delete(`/api/microposts/${micropostToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const micropostsAfterDeleteRequest = await helper.getMicropostsInDb();
    expect(micropostsAfterDeleteRequest.length).toBe(
      micropostsBeforeDeleteRequest.length - 1
    );
    const micropostsContents = micropostsAfterDeleteRequest.map(
      (micropost) => micropost.content
    );
    expect(micropostsContents).not.toContain(micropostToDelete.content);
  });

  test('deletes micropost sucessfully if valid id and logged in as non-author admin', async () => {
    const token = await helper.getUserTokenByUsername(userAdmin.username);

    const micropostsBeforeDeleteRequest = await helper.getMicropostsInDb();
    const micropostsByLoggedUser = await helper.getMicropostsByUsername(
      userNonAdmin.username
    );
    const micropostToDelete = micropostsByLoggedUser[0];

    await api
      .delete(`/api/microposts/${micropostToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const micropostsAfterDeleteRequest = await helper.getMicropostsInDb();
    expect(micropostsAfterDeleteRequest.length).toBe(
      micropostsBeforeDeleteRequest.length - 1
    );
    const micropostsContents = micropostsAfterDeleteRequest.map(
      (micropost) => micropost.content
    );
    expect(micropostsContents).not.toContain(micropostToDelete.content);
  });

  test('fails with status code 401 if valid id and logged in as non-author non-admin', async () => {
    const token = await helper.getUserTokenByUsername(userNonAdmin.username);

    const micropostsByLoggedUser = await helper.getMicropostsByUsername(
      userAdmin.username
    );
    const micropostToDelete = micropostsByLoggedUser[0];

    await api
      .delete(`/api/microposts/${micropostToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(401);
  });

  test('fails with statuscode 404 if micropost does not exist and logged in as admin', async () => {
    const token = await helper.getUserTokenByUsername(userAdmin.username);
    const nonExistingMicropostId = await helper.nonExistingMicropostId();

    await api
      .delete(`/api/microposts/${nonExistingMicropostId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404);
  });

  test('fails with statuscode 400 if invalid micropost id and logged in as admin', async () => {
    const token = await helper.getUserTokenByUsername(userAdmin.username);
    const invalidId = 'asdlu12y938o2';

    await api
      .delete(`/api/microposts/${invalidId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
