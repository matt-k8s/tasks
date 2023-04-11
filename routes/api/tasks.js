var express = require("express");
var router = express.Router();

router.post("/", async (req, res, next) => {
  const { body } = req;
  if (!body.description) {
    return res.status(400).json({
      errorMessage: "No description provided.",
    });
  }
  let response;
  try {
    response = await req.app.locals.db.query(
      "INSERT INTO tasks (description) VALUES($1) RETURNING *",
      [body.description]
    );
  } catch (err) {
    console.log(err);
  }

  const task = response.rows[0];

  const isCached = await req.app.locals.cache.set(
    task.taskid,
    JSON.stringify(task)
  );

  return res.json({
    errorMessage: null,
    isCached: isCached == "OK" ? true : false,
    data: response.rows,
  });
});

router.get("/", async (req, res, next) => {
  let response;
  try {
    response = await req.app.locals.db.query("SELECT * FROM tasks LIMIT 1000");
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

router.get("/:taskId", async (req, res, next) => {
  const { params } = req;
  let cachedResult;
  let response;
  try {
    cachedResult = await req.app.locals.cache.get(params.taskId);
    if (!cachedResult) {
      response = await req.app.locals.db.query(
        "SELECT * FROM tasks WHERE taskid = $1 LIMIT 1",
        [params.taskId]
      );
      return res.json({
        errorMessage: null,
        isCached: "false",
        data: response.rows,
      });
    } else {
      return res.json({
        errorMessage: null,
        isCached: true,
        data: [cachedResult],
      });
    }
  } catch (err) {
    console.log(err.message);
  }
});

router.put("/:taskId", async (req, res, next) => {
  const {
    params: { taskId },
    body: { description },
  } = req;

  let response;
  try {
    const isCached = await req.app.locals.cache.set(
      taskId,
      JSON.stringify({ taskid: taskId, description: description })
    );

    response = await req.app.locals.db.query(
      "UPDATE tasks SET description = $1 WHERE taskid = $2 RETURNING *",
      [description, taskId]
    );

    return res.json({
      errorMessage: null,
      isCached: isCached == "OK" ? true : false,
      data: response.rows,
    });
  } catch (err) {
    console.log(err.message);
  }
});

router.delete("/:taskId", async (req, res, next) => {
  const {
    params: { taskId },
  } = req;
  let response;
  try {
    deletedCount = await req.app.locals.cache.del(taskId)
    response = await req.app.locals.db.query(
      "DELETE FROM tasks WHERE taskid = $1 RETURNING *",
      [taskId]
    );

    return res.json({
      errorMessage: null,
      isDeleted: deletedCount == 1 ? true : false,
      data: response.rows,
    });
  } catch (err) {
    if (err) {
      throw err;
      process.exit(1);
    }
  }
});

module.exports = router;
