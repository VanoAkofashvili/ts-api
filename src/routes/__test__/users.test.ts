import request from "supertest";
import app from "../../app";
import { Context } from "../../test/context";

const api = request(app());

let context: Context;
beforeAll(async () => {
  context = await Context.build();
})

afterAll(async () => {
  return await context.close();
})

async function createUser() {
  const user1 = await api
    .post('/api/users/signup')
    .send({
      email: `rand-${Math.random()}@test.com`,
      firstname: 'ttest',
      password: 'vano',
      confirmPassword: 'vano'
    })
  return user1;
}

describe('users route', () => {

  describe('signup', () => {
    const endpoint = '/api/users/signup';

    it('has a route handler listening to /api/users/signup for post requests', async () => {
      const response = await api.post(endpoint).send({});
      expect(response.status).not.toEqual(404);
    });

    it('returns a 201 on successfull request', async () => {
      return api.post(endpoint).send({
        email: 'test@gmail.com',
        firstname: 'vano',
        password: 'vano1234',
        confirmPassword: 'vano1234'
      }).expect(201);
    })

    it('returns a 400 when invalid email is supplied', async () => {
      return api.post(endpoint).send({
        email: 'asdf',
        password: 'vano1234',
        firstname: 'vano'
      })
    })

    it('returns a 400 when invalid password is supplied', async () => {
      return api.post(endpoint).send({
        email: 'vano@gmail.com',
        password: '',
        confirmPassword: '12345',
        firstname: 'vano'
      })
    })

    it('returns a 400 when invalid confirmPassword is supplied', async () => {
      await api.post(endpoint).send({
        email: 'vano@gmail.com',
        password: 'vano1234',
        confirmPassword: '',
        firstname: 'vano'
      }).expect(400)
    })

    it('returns a 400 if confirmPassword is not equal to password', async () => {
      await api.post(endpoint).send({
        email: 'vano@gmail.com',
        password: 'vano',
        confirmPassword: 'vano123',
        firstname: 'vano'
      }).expect(400);
    })

    it('forbids duplicate emails', async () => {
      await api
        .post(endpoint)
        .send({
          email: 'test1@test.com',
          password: 'password',
          confirmPassword: 'password',
          firstname: 'vano'
        })
        .expect(201);

      await api
        .post(endpoint)
        .send({
          email: 'test1@test.com',
          password: 'password',
          confirmPassword: 'password',
          firstname: 'vano'
        })
        .expect(400);
    });

    it('returns 400 when password length is less than 4 characters long', async () => {
      await api
        .post(endpoint)
        .send({
          email: 'vanikoakofa@gmail.com',
          password: 'v',
          firstname: 'vano'
        })
    })

    it('forbids only spaces in place of password and firstname', async () => {
      await api
        .post(endpoint)
        .send({
          email: 'test@test.com',
          password: '         ',
          firstname: '         '
        })
    })
  })



  describe('signin', () => {

    beforeEach(async () => {
      await context.reset();
    })

    const endpoint = '/api/users/signin';

    it('has a route handler listening to /api/users/signin for post requests', async () => {
      const response = await api.post(endpoint).send({});
      expect(response.status).not.toEqual(404);
    });

    it('fails when email that does not exist is supplied', async () => {
      await api.post(endpoint).send({
        email: 'vano@test.com',
        password: '1234'
      })
        .expect(400);
    })

    it('fails when an incorrect password is supplied', async () => {
      await api
        .post('/api/users/signup')
        .send({
          email: 'vanikoakofa@gmail.com',
          firstname: 'vano',
          password: 'vano1234',
          confirmPassword: 'vano1234',
        })
        .expect(201)

      await api
        .post(endpoint)
        .send({
          email: 'vanikoakofa@gmail.com',
          password: 'vvvv'
        })
        .expect(400)
    })

    it('responds with a jwt when given valid credentials', async () => {
      await api
        .post('/api/users/signup')
        .send({
          email: 'vanikoakofa@gmail.com',
          firstname: 'vano',
          password: 'vano1234',
          confirmPassword: 'vano1234',
        })
        .expect(201)

      const response = await api
        .post(endpoint)
        .send({
          email: 'vanikoakofa@gmail.com',
          password: 'vano1234'
        })
        .expect(200)

      expect(response.body.data.jwt).toBeDefined();
    })
  })

  describe('add friend', () => {
    const endpoint = '/api/users/addfriend';
    it('has a route handler listening to /api/users/addfriend for post request', async () => {
      const response = await api.post(endpoint).send({});
      expect(response.status).not.toEqual(404);
    })


    it('returns a 401 on unauthorized request', async () => {

      await api
        .post(endpoint)
        .send({
          friendId: 1
        })
        .expect(401)
    })

    it('returns  a 400 when invalid friendId is supplied', async () => {
      await api
        .post(endpoint)
        .set(context.signin().header)
        .send({
          friendId: 'vaniko'
        })
        .expect(400)

      await api
        .post(endpoint)
        .set(context.signin().header)
        .send({
          friendId: -100
        })
        .expect(400)
    })

    it('add adds a friend on valid input', async () => {
      const user1 = await api
        .post('/api/users/signup')
        .send({
          email: 'test@test.com',
          firstname: 'ttest',
          password: 'vano',
          confirmPassword: 'vano'
        })
        .expect(201);
      const user2 = await api
        .post('/api/users/signup')
        .send({
          email: 'test2@test.com',
          firstname: 'ttest',
          password: 'vano',
          confirmPassword: 'vano'
        })
        .expect(201);

      await api
        .post(endpoint)
        .set({ Authorization: user1.body.data.jwt })
        .send({
          friendId: user2.body.data.id
        })
        .expect(201)
    })
  })


  describe('remove friend', () => {
    const endpoint = '/api/users/removefriend';
    it('has a route handler listening to /api/users/removefriend for post request', async () => {
      const response = await api.post(endpoint).send({})
      expect(response.status).not.toEqual(404);
    })

    it('is only accessible for authenticated users', async () => {
      await api
        .post(endpoint)
        .send({
          friendId: 1
        })
        .expect(401)
    })

    it('returns 400 when friendId is invalid', async () => {
      const response = await api.post(endpoint)
        .set(context.signin().header)
        .send({
          friendId: -1
        })
        .expect(400);
      console.log(response.body);

      await api.post(endpoint)
        .set(context.signin().header)
        .send({
          friendId: 'friendId'
        })
        .expect(400);
    })

    it('removes friend from friendList on valid inputs', async () => {
      const user1 = await createUser();
      const user2 = await createUser();

      await api
        .post('/api/users/addfriend')
        .set({ Authorization: user1.body.data.jwt }) // logged in user (user1)
        .send({
          friendId: user2.body.data.id // (user1 is adding user2)
        })
        .expect(201)


      await api.post(endpoint)
        .set({ Authorization: user1.body.data.jwt })
        .send({
          friendId: user2.body.data.id
        }).expect(200);
    })
  })


})