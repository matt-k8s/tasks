var express = require("express");
var router = express.Router();
const db = require("../db");

router.post("/tasks", async (req, res, next) => {
  const { body } = req;
  if (!body.description) {
    return res.status(400).json({
      errorMessage: "No description provided.",
    });
  }
  let response;
  try {
    response = await db.query(
      "INSERT INTO tasks (description) VALUES($1) RETURNING *",
      [body.description]
    );
    await db.end();
  } catch (err) {
    console.log(err.message);
  }

  return res.json({
    errorMessage: null,
    data: response.rows,
  });
});

router.get("/tasks", async (req, res, next) => {
  let response;
  try {
    response = await db.query("SELECT * FROM tasks LIMIT 10");
    await db.end();
  } catch (err) {
    return res.status(500).json({
      errorMessage: "Database error",
    });
    console.log(err.message);
  }
  return res.json({
    errorMessage: null,
    data: response.rows,
  });
});

router.get("/tasks/:taskId", async (req, res, next) => {
  const { params } = req;
  let response;
  try {
    response = await db.query("SELECT * FROM tasks WHERE taskid = $1 LIMIT 1", [
      params.taskId,
    ]);
  } catch (err) {
    console.log(err.message);
  }

  return res.json({
    errorMessage: null,
    data: response.rows,
  });
});

router.put("/tasks/:taskId", async (req, res, next) => {
  const {
    params: { taskId },
    body: { description },
  } = req;

  let response;
  try {
    response = await db.query(
      "UPDATE tasks SET description = $1 WHERE taskid = $2 RETURNING *",
      [description, taskId]
    );
  } catch (err) {
    console.log(err.message);
  }
  return res.json({
    errorMessage: null,
    data: response.rows,
  });
});

router.delete("/tasks/:taskId", async (req, res, next) => {
  const {
    params: { taskId },
  } = req;
  let response;
  try {
    response = await db.query(
      "DELETE FROM tasks WHERE taskid = $1 RETURNING *",
      [taskId]
    );
  } catch (err) {
    if (err) {
      throw err;
      process.exit(1);
    }
  }
  return res.json({
    errorMessage: null,
    deleted: true,
    data: response.rows,
  });
});

module.exports = router;
