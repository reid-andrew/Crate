import request from 'supertest';
import express from 'express';
import graphqlHTTP from 'express-graphql'
import schema from '../../setup/schema'

describe("user queries", () => {
  let server;

  beforeAll(() => {
    server = express();
    server.use(
      '/',
      graphqlHTTP({
        schema: schema,
        graphiql: false
      })
    );
  });

  it("returns all users", async () => {
    const response = await request(server)
      .get('/')
      .send({ query: '{users { name email password } }'})
      .expect(200)

    // console.log(response.body.data)
    expect(response.body.data.users.length).toEqual(2)
  })

  it ("return a user with a specific id", async() => {
    const response = await request(server)
      .get('/')
      .send({ query: '{user(id: 1) { name email role } }'})
      .expect(200)

    // console.log(response.body.data)
    expect(response.body.data.user.name).toEqual("The Admin")
  })

  it ("authorizes a valid user", async() => {
    const response = await request(server)
      .get('/')
      .send({ query: '{ userLogin(email: "user@crate.com", password: "123456") { user { id name role email } } }'})
      .expect(200)

      // console.log(response.body.data)
      expect(response.body.data.userLogin.user.name).toEqual("The User")
  })

  it ("gets user genders", async() => {
    const response = await request(server)
      .get('/')
      .send({ query: '{ userGenders { id name } }'})
      .expect(200)

      // console.log(response.body.data)
      expect(response.body.data.userGenders[0].name).toEqual('Male')
      expect(response.body.data.userGenders[1].name).toEqual('Female')
  })

// realized this query repeated an existing one for user
  it ("gets style summary for a user", async() => {
    const response = await request(server)
      .get('/')
      .send({query: '{ user(id:1) { styleSummary } }'})
      .expect(200)

      // console.log(response.body.data)
      expect(response.body.data.user.styleSummary).toEqual(null)
  })
})
