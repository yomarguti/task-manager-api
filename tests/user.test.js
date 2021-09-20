const request = require("supertest");
const app = require("../src/app");

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Maria Perez",
      email: "maria.perez@gmail.com",
      password: "1234567",
    })
    .expect(201);
});
