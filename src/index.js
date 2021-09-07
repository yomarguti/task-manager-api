require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("./db/mongoose");

const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
