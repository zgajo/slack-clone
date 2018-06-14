import axios from "axios";

describe("User resolvers", () => {
  test("allUsers", async () => {
    const response = await axios.post("http://localhost:4001/graphql", {
      query: `
          {
              allUsers {
                  id
                  username
                  email
              }
          }
          `
    });

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        allUsers: []
      }
    });
  });

  test("register", async () => {
    const response = await axios.post("http://localhost:4001/graphql", {
      query: `
              mutation{
                  register(username: "testuser", email:"test@test.hr", password: "passtest") {
                      ok
                      errors{
                          path
                          message
                      }
                      user{
                          username
                          email
                      }
                  }
              }
              `
    });

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        register: {
          ok: true,
          errors: null,
          user: {
            username: "testuser",
            email: "test@test.hr"
          }
        }
      }
    });
  });

  test("login and create team", async () => {
    const response = await axios.post("http://localhost:4001/graphql", {
      query: `
        mutation{
            login(email: "test@test.hr", password: "passtest") {
              ok
              token
              refreshToken
              errors {
                path
                message
              }
            }
          }
                `
    });

    const {
      data: {
        data: {
          login: { ok, token, refreshToken }
        }
      }
    } = response;

    expect(ok).toBeTruthy();

    const responseCreateTeam = await axios.post(
      "http://localhost:4001/graphql",
      {
        query: `
        mutation {
            createTeam(name: "team1") {
              ok
              team {
                name
              }
            }
          }
                  `
      },
      {
        headers: {
          "x-token": token,
          "x-refresh-token": refreshToken
        }
      }
    );

    const { data } = responseCreateTeam;

    expect(data).toMatchObject({
      data: {
        createTeam: {
          ok: true,
          team: {
            name: "team1"
          }
        }
      }
    });
  });
});
