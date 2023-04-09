const app = require("../app");
const db = require("../db");
const request = require("supertest");

jest.mock("../db");

afterEach(() => {
  jest.resetAllMocks();
});

it("POST /tasks creates a task", async () => {
  db.query.mockImplementationOnce(() =>
    Promise.resolve({
      rows: [
        {
          taskId: "abc123",
          description: "Do the dishes.",
        },
      ],
    })
  );

  const response = await request(app)
    .post("/tasks")
    .send({
      description: "Do the dishes.",
    })
    .expect(200)
    .expect("content-type", /json/);

  expect(response.body).toEqual({
    errorMessage: null,
    data: [
      {
        taskId: "abc123",
        description: "Do the dishes.",
      },
    ],
  });
});

it("POST /tasks returns 400 bad request and a descriptive error message when there is no description provided", async () => {
  db.query.mockImplementationOnce(() => Promise.resolve({}));

  const response = await request(app)
    .post("/tasks")
    .send({})
    .expect(400)
    .expect("Content-Type", /json/);

  expect(response.body).toEqual({
    errorMessage: "No description provided.",
  });
});

it("GET /tasks returns a 500 Internal Server Error when the database throws an Error ", async () => {
  db.query.mockImplementationOnce(() =>
    Promise.reject(new Error("Database error"))
  );

  await request(app).get("/tasks").expect(500);
});

it("GET /tasks returns tasks", async () => {
  db.query.mockImplementationOnce(() =>
    Promise.resolve({
      rows: [
        {
          taskId: "abc123",
          description: "Do the windows.",
        },
        {
          taskId: "abc456",
          description: "Do the shopping.",
        },
      ],
    })
  );

  const response = await request(app)
    .get("/tasks")
    .expect(200)
    .expect("Content-Type", /json/);

  expect(response.body).toEqual({
    errorMessage: null,
    data: [
      {
        taskId: "abc123",
        description: "Do the windows.",
      },
      {
        taskId: "abc456",
        description: "Do the shopping.",
      },
    ],
  });
});

it("GET /task/:taskId returns a task", async () => {
  db.query.mockImplementationOnce(() =>
    Promise.resolve({
      rows: [
        {
          taskId: "abc123",
          description: "Do the dishes.",
        },
      ],
    })
  );

  const response = await request(app)
    .get("/tasks/abc123")
    .expect(200)
    .expect("Content-type", /json/);

  expect(response.body).toEqual({
    data: [{ description: "Do the dishes.", taskId: "abc123" }],
    errorMessage: null,
  });
});

it("PUT /task/:taskId updates a task", async () => {
  db.query.mockImplementationOnce(() =>
    Promise.resolve({
      rows: [{ taskId: "abc123", description: "Hoover the floor." }],
    })
  );

  const response = await request(app)
    .put("/tasks/abc123")
    .send({ description: "Hoover the floor." })
    .expect(200)
    .expect("Content-Type", /json/);

  expect(response.body).toEqual({
    errorMessage: null,
    data: [
      {
        taskId: "abc123",
        description: "Hoover the floor.",
      },
    ],
  });
});

it("DELETE /task:taskId deletes a task", async () => {
  db.query.mockImplementationOnce(() =>
    Promise.resolve({
      rows: [
        {
          taskId: "abc123",
          description: "Hoover the floor.",
        },
      ],
    })
  );
  const response = await request(app)
    .delete("/tasks/abc123")
    .expect(200)
    .expect("Content-Type", /json/);

  expect(response.body).toEqual({
    errorMessage: null,
    deleted: true,
    data: [
      {
        taskId: "abc123",
        description: "Hoover the floor.",
      },
    ],
  });
});
