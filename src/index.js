const app = require("./app");
const logger = require("morgan");

app.use(logger("dev"));

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
