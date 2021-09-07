const router = require("express").Router();
const auth = require("../middlewares/auth");

const Task = require("../models/Task");

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });

    await task.save();
    res.status(201).send({ task });
  } catch (err) {
    res
      .status(400)
      .send({ error: "An error ocurred while creating the new task" });
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    //const tasks = await Task.find({ owner: req.user._id });
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.status(200).send(req.user.tasks);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ error: "An error ocurred while retrieving the tasks" });
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const { id: _id } = req.params;
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send();
      return;
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      res.status(404).send();
      return;
    }

    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();

    res.status(200).send({ task });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.patch("/completedAll", auth, async (req, res) => {
  try {
    const { ids } = req.body;
    await Task.updateMany(
      {
        _id: {
          $in: ids,
        },
        owner: req.user._id,
      },
      {
        completed: true,
      }
    );
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      res.status(404).send();
      return;
    }

    res.send(task);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.delete("/tasks", auth, async (req, res) => {
  try {
    const { ids } = req.body;
    await Task.deleteMany({
      _id: {
        $in: ids,
      },
      owner: req.user._id,
    });

    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

module.exports = router;
