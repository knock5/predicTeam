const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const router = require("./routes");
const app = express();

const port = 8008;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// set engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// routes
app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
