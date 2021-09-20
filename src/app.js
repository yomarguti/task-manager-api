const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("./db/mongoose");

const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

module.exports = app;
