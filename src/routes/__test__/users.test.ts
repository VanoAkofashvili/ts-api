import request from "supertest";
import app from "../../app";
import { Context } from "../../test/context";

const api = request(app());

let context: Context;
beforeAll(async () => {
  context = await Context.build();
})

afterAll(async () => {
  return context.close();
})


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
        password: 'vano1234'
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
        firstname: 'vano'
      })
    })


    it('forbids duplicate emails', async () => {
      await api
        .post(endpoint)
        .send({
          email: 'test1@test.com',
          password: 'password',
          firstname: 'vano'
        })
        .expect(201);

      await api
        .post(endpoint)
        .send({
          email: 'test1@test.com',
          password: 'password',
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
          password: 'vano1234'
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
          password: 'vano1234'
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

  describe.only('add friend', () => {
    const endpoint = '/api/users/addfriend';
    it('has a route handler listening to /api/users/addfriend for post requiest', async () => {
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
  })


})