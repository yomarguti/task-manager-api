const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const Task = require("../src/models/Task");

const { taskOne, userOne, userTwo, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From my test",
    })
    .expect(201);

  const task = await Task.findById(response.body.task._id);

  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test("Should fetch users tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body).toHaveLength(3);
});

test("Should not delete other users tasks", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test("Should not create task with invalid description/completed", async () => {
  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({ completed: "random string" })
    .expect(400);
});

test("Should not update task with invalid description/completed", async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ completed: "random string" })
    .expect(500);
});

test("Should delete user task", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  const task = await Task.findByIdAndDelete(taskOne._id);
  expect(task).toBeNull();
});

test("Should not delete user task if unauthenticated", async () => {
  await request(app).delete(`/tasks/${taskOne._id}`).expect(401);
});

test("Should not update other users task", async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({ completed: true })
    .expect(404);
});

test("Should fetch task by id", async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
});

test("Should not fetch task by id if not authenticated", async () => {
  await request(app).get(`/tasks/${taskOne._id}`).expect(401);
});

test("Should not fetch other user task by id", async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(404);
});

test("Should fetch only completed tasks", async () => {
  const response = await request(app)
    .get(`/tasks?completed=true`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  response.body.forEach((tsk) => {
    expect(tsk.completed).toBe(true);
  });
});

test("Should fetch only incompleted tasks", async () => {
  const response = await request(app)
    .get(`/tasks?completed=false`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  response.body.forEach((tsk) => {
    expect(tsk.completed).toBe(false);
  });
});

test("Should sort tasks by description", async () => {
  const response = await request(app)
    .get(`/tasks?sort=description:asc`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body[0].description).toBe("First Task");
});

test("Should sort tasks by completed", async () => {
  const response = await request(app)
    .get(`/tasks?sort=completed:asc`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body[0].description).toBe("First Task");
});

test("Should sort tasks by createdAt", async () => {
  const response = await request(app)
    .get(`/tasks?sort=createdAt:asc`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body[0].description).toBe("First Task");
});

test("Should sort tasks by updatedAt", async () => {
  const response = await request(app)
    .get(`/tasks?sort=updatedAt:asc`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body[0].description).toBe("First Task");
});

test("Should fetch page of tasks", async () => {
  const response = await request(app)
    .get(`/tasks?limit=2&skip=2`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body[0].description).toBe("Fourth Task");
});
