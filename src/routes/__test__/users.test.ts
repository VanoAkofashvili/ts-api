import request from "supertest";
import app from "../../app";

const api = request(app());

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

    it('returns a 400 with missing email ,password and firstname', async () => {
      await api
        .post(endpoint)
        .send({
          email: 'test@test.com'
        })
        .expect(400);

      await api
        .post(endpoint)
        .send({
          password: 'aa'
        })
        .expect(400);

      await api.post(endpoint).send({
        firstname: 'vano'
      })
    });

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
  })



  describe('signin', () => {
    const endpoint = '/api/users/signin';

    it('has a route handler listening to /api/users/signin for post requests', async () => {
      const response = await api.post(endpoint).send({});
      expect(response.status).not.toEqual(404);
    });

    it('fails when email that does not exist is supplied', async () => {
      await api.post(endpoint).send({
        email: 'vano@test.com',
        password: '1234'
      }).expect(400);
    })
  })


})