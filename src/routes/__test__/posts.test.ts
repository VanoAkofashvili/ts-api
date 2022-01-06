import request from "supertest";
import app from "../../app";
import { Post } from "../../repositories/posts.repo";
import { User } from "../../repositories/users.repo";
import { Context } from "../../test/context";

const api = request(app());

let context: Context;
beforeAll(async () => {
  context = await Context.build();
})

afterAll(async () => {
  return await context.close();
})


describe('posts route', () => {

  describe('signup', () => {
    const endpoint = '/api/posts';

    it('has a route handler listening to /api/posts for post requests', async () => {
      const response = await api.post(endpoint).send({});
      expect(response.status).not.toEqual(404);
    });

    it('is only accessed if the user is authenticated', async () => {
      await api
        .post(endpoint)
        .send({
          caption: 'new post'
        })
        .expect(401);
    })

    it('returns a status other than 401 if the user is authenticated', async () => {
      const response = await api
        .post(endpoint)
        .set(context.signin().header)
        .send({
          caption: 'post'
        })


      expect(response.status).not.toEqual(401);
    })

    it('returns an error if invalid caption is supplied', async () => {
      await api
        .post(endpoint)
        .set(context.signin().header)
        .send({
          caption: ''
        })

      await api
        .post(endpoint)
        .set(context.signin().header)
        .send({});
    })

    it('creates a post with valid inputs', async () => {
      let posts = await Post.find({});
      expect(posts.length).toEqual(0);

      await User.create({ email: 'vanikoakofa@gmail.com', firstname: 'vano', password: 'vano' })

      const user = context.signin();

      const res = await api
        .post(endpoint)
        .set(user.header)
        .send({
          caption: 'new post',
          userId: user.userId
        })
        .expect(201)

      posts = await Post.find({});

      expect(posts.length).toEqual(1);

    })
  })
})