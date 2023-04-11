const app = require("../../app");
const db = require("../../db");
const cache = require("../../cache");
const request = require("supertest");

jest.mock("../../db");
jest.mock("../../cache");

afterEach(() => {
  jest.resetAllMocks();
});

describe("tasks app", () => {
  describe("data sources", () => {
    test("GET /tasks returns a 500 error when the db throws an error", async () => {
      db.query.mockRejectedValue("Failed to connect");

      const response = await request(app).get("/api/tasks").expect(500);
    });
  });

  describe("creating a task", () => {
    test("POST /tasks creates a task, sets to cache and stores in db", async () => {
      db.query.mockResolvedValue({
        rows: [
          {
            description: "Do the dishes.",
          },
        ],
      });

      cache.set.mockResolvedValue("OK");

      const response = await request(app)
        .post("/api/tasks")
        .send({
          description: "Do the dishes.",
        })
        .expect(200)
        .expect("content-type", /json/);

      expect(cache.set).toHaveBeenCalledTimes(1);

      expect(response.body).toEqual({
        errorMessage: null,
        isCached: true,
        data: [
          {
            description: "Do the dishes.",
          },
        ],
      });
    });

    test("POST /tasks returns 400 error when no description given", async () => {
      db.query.mockImplementationOnce(() => Promise.resolve({}));

      const response = await request(app)
        .post("/api/tasks")
        .send({})
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        errorMessage: "No description provided.",
      });
    });
  });

  describe("getting a task", () => {
    test("GET /task/:taskId returns a task from cache", async () => {
      cache.get.mockResolvedValue({
        description: "Do the dishes.",
        taskId: "1",
      });

      const response = await request(app)
        .get("/api/tasks/1")
        .expect(200)
        .expect("Content-type", /json/);

      expect(response.body).toEqual({
        errorMessage: null,
        isCached: true,
        data: [{ description: "Do the dishes.", taskId: "1" }],
      });

      expect(cache.get).toBeCalledTimes(1);
    });
  });

  describe("getting all tasks", () => {
    test("GET /tasks returns tasks", async () => {
      db.query.mockImplementationOnce(() =>
        Promise.resolve({
          rows: [
            {
              taskId: "1",
              description: "Do the windows.",
            },
            {
              taskId: "2",
              description: "Do the shopping.",
            },
          ],
        })
      );

      const response = await request(app)
        .get("/api/tasks")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        errorMessage: null,
        data: [
          {
            taskId: "1",
            description: "Do the windows.",
          },
          {
            taskId: "2",
            description: "Do the shopping.",
          },
        ],
      });
    });
  });

  describe("updating a task", () => {
    test("PUT /task/:taskId updates a task, in both the db and cache", async () => {
      db.query.mockResolvedValue({
        rows: [{ taskId: "1", description: "Hoover the floor." }],
      });

      cache.set.mockResolvedValue("OK");

      const response = await request(app)
        .put("/api/tasks/1")
        .send({ description: "Hoover the floor." })
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        errorMessage: null,
        isCached: true,
        data: [
          {
            taskId: "1",
            description: "Hoover the floor.",
          },
        ],
      });

      expect(cache.set).toBeCalledTimes(1);
      expect(db.query).toBeCalledTimes(1);
    });
  });

  describe("deleting a task", () => {
    test("DELETE /task:taskId deletes a task, in both the db and cache", async () => {
      db.query.mockResolvedValue({
        rows: [
          {
            taskId: "1",
            description: "Hoover the floor.",
          },
        ],
      });

      cache.del.mockResolvedValue(1);

      const response = await request(app)
        .delete("/api/tasks/1")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        errorMessage: null,
        isDeleted: true,
        data: [
          {
            taskId: "1",
            description: "Hoover the floor.",
          },
        ],
      });

      expect(cache.del).toBeCalledTimes(1);
      expect(db.query).toBeCalledTimes(1);
    });
  });
});
