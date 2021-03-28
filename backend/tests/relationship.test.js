const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');

const Micropost = require('../components/micropost/micropostModel');
const User = require('../components/user/userModel');
const Relationship = require('../components/relationship/relationshipModel');

const api = supertest(app);

beforeEach(async () => {
  await Micropost.deleteMany({});
  await User.deleteMany({});
  await Relationship.deleteMany({});

  const userCreationPromises = helper.initialUsers.map(
    async (userCredentials) => helper.addUserFromCredentials(userCredentials)
  );

  await Promise.all(userCreationPromises);

  const follower = await helper.getUserByUsername(
    helper.initialRelationships[0].followerUsername
  );
  const followed = await helper.getUserByUsername(
    helper.initialRelationships[0].followedUsername
  );

  await helper.addRelationshipAndAssignToBothUsers(follower.id, followed.id);
});

describe('GET /relationships', () => {
  test('relationships are returned as json', async () => {
    await api
      .get('/api/relationships')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  test('all relationships are returned', async () => {
    const response = await api.get('/api/relationships');
    expect(response.body.length).toBe(helper.initialRelationships.length);
  });
  test('all relationships have correct follower and followed username', async () => {
    const response = await api.get('/api/relationships');
    const followerUsernames = response.body.map(
      (relationship) => relationship.follower.username
    );
    const followedUsernames = response.body.map(
      (relationship) => relationship.followed.username
    );

    helper.initialRelationships.forEach((relationship) => {
      expect(followerUsernames).toContain(relationship.followerUsername);
      expect(followedUsernames).toContain(relationship.followedUsername);
    });
  });
});

describe('GET /relationships/:id', () => {
  test('returns user sucessfully if valid id', async () => {
    const relationshipsInDatabase = await helper.getRelationshipsInDb();
    const validRelationship = relationshipsInDatabase[0];
    const validRelationshipFollower = await helper.getUserFromDbById(
      validRelationship.follower
    );
    const validRelationshipFollowed = await helper.getUserFromDbById(
      validRelationship.followed
    );

    const relationshipReturned = await api
      .get(`/api/relationships/${validRelationship.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(relationshipReturned.body.follower.username).toEqual(
      validRelationshipFollower.username
    );
    expect(relationshipReturned.body.followed.username).toEqual(
      validRelationshipFollowed.username
    );
    expect(relationshipReturned.body.date).toEqual(
      validRelationship.date.toISOString()
    );
  });

  test('fails with statuscode 404 if relationship does not exist', async () => {
    const nonExistingRelationshipId = await helper.nonExistingRelationshipId();

    await api
      .get(`/api/relationships/${nonExistingRelationshipId}`)
      .expect(404);
  });

  test('fails with statuscode 400 if invalid relationship id', async () => {
    const invalidId = 'asdlu12y938o2';

    await api.get(`/api/relationships/${invalidId}`).expect(400);
  });
});

describe('POST /relationships/', () => {
  let token;
  let follower;

  beforeEach(async () => {
    follower = await helper.addUserFromCredentials({
      username: 'follower',
      email: 'follower@follower.com',
      password: 'follower',
      admin: false,
    });
    token = await helper.getUserTokenByUsername(follower.username);
  });

  test('creates relationship sucessfully if valid data', async () => {
    const followed = await User.findOne({
      username: { $ne: follower.username },
    });

    const newRelationship = {
      followed: followed.id,
    };

    await api
      .post('/api/relationships')
      .set('Authorization', `bearer ${token}`)
      .send(newRelationship)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const relationshipsAfterPostRequest = await helper.getRelationshipsInDb();
    expect(relationshipsAfterPostRequest.length).toBe(
      helper.initialRelationships.length + 1
    );

    expect(relationshipsAfterPostRequest).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          follower: mongoose.Types.ObjectId(follower.id),
          followed: mongoose.Types.ObjectId(followed.id),
        }),
      ])
    );
  });

  test('fails with statuscode 400 if following self', async () => {
    const newRelationship = {
      followed: follower.id,
    };

    await api
      .post('/api/relationships')
      .set('Authorization', `bearer ${token}`)
      .send(newRelationship)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with statuscode 400 if invalid data', async () => {
    const newRelationship = {};

    await api
      .post('/api/relationships')
      .set('Authorization', `bearer ${token}`)
      .send(newRelationship)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with 401 status if invalid token', async () => {
    const followed = await User.findOne({
      username: { $ne: follower.username },
    });

    const newRelationship = {
      followed: followed.id,
    };

    await api
      .post('/api/relationships')
      .set('Authorization', 'asd182d9012h8d0saj0d9182')
      .send(newRelationship)
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });
});

describe('DELETE /relationships/:id', () => {
  let userAdmin;
  let userNonAdmin;

  beforeEach(async () => {
    userNonAdmin = await helper.getUserByAdminRights(false);
    userAdmin = await helper.getUserByAdminRights(true);

    await helper.addRelationshipAndAssignToBothUsers(
      userNonAdmin.id,
      userAdmin.id
    );
  });

  test('deletes relationship sucessfully if valid id and logged in as non-admin follower', async () => {
    const token = await helper.getUserTokenByUsername(userNonAdmin.username);

    const relationshipsBeforeDeleteRequest = await helper.getRelationshipsInDb();
    const relationshipsByLoggedUser = await helper.getRelationshipsByFollower(
      userNonAdmin.username
    );
    const relationshipToDelete = relationshipsByLoggedUser[0];

    await api
      .delete(`/api/relationships/${relationshipToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const relationshipsAfterDeleteRequest = await helper.getRelationshipsInDb();
    expect(relationshipsAfterDeleteRequest.length).toBe(
      relationshipsBeforeDeleteRequest.length - 1
    );

    expect(relationshipsAfterDeleteRequest).not.toMatchObject({
      follower: userNonAdmin.id,
      followed: userAdmin.id,
    });
  });

  test('deletes micropost sucessfully if valid id and logged in as non-follower admin', async () => {
    const token = await helper.getUserTokenByUsername(userAdmin.username);

    const relationshipsBeforeDeleteRequest = await helper.getRelationshipsInDb();
    const relationshipsByLoggedUser = await helper.getRelationshipsByFollower(
      userNonAdmin.username
    );
    const relationshipToDelete = relationshipsByLoggedUser[0];

    await api
      .delete(`/api/relationships/${relationshipToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const relationshipsAfterDeleteRequest = await helper.getRelationshipsInDb();
    expect(relationshipsAfterDeleteRequest.length).toBe(
      relationshipsBeforeDeleteRequest.length - 1
    );

    expect(relationshipsAfterDeleteRequest).not.toMatchObject({
      follower: userNonAdmin.id,
      followed: userAdmin.id,
    });
  });

  test('fails with status code 401 if valid id and logged in as non-follower non-admin', async () => {
    const token = await helper.getUserTokenByUsername(userNonAdmin.username);

    const relationshipsBeforeDeleteRequest = await helper.getRelationshipsInDb();
    const relationshipsByLoggedUser = await helper.getRelationshipsByFollower(
      userAdmin.username
    );
    const relationshipToDelete = relationshipsByLoggedUser[0];

    await api
      .delete(`/api/relationships/${relationshipToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(401);

    const relationshipsAfterDeleteRequest = await helper.getRelationshipsInDb();
    expect(relationshipsAfterDeleteRequest.length).toBe(
      relationshipsBeforeDeleteRequest.length
    );

    expect(relationshipsAfterDeleteRequest).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          follower: mongoose.Types.ObjectId(userAdmin.id),
          followed: mongoose.Types.ObjectId(userNonAdmin.id),
        }),
      ])
    );
  });

  test('fails with statuscode 404 if relationship does not exist and logged in as admin', async () => {
    const token = await helper.getUserTokenByUsername(userAdmin.username);
    const nonExistingRelationshipId = await helper.nonExistingRelationshipId();

    await api
      .delete(`/api/relationships/${nonExistingRelationshipId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404);
  });

  test('fails with statuscode 400 if invalid relationship id and logged in as admin', async () => {
    const token = await helper.getUserTokenByUsername(userAdmin.username);

    const invalidId = 'asdlu12y938o2';

    await api
      .delete(`/api/relationships/${invalidId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
