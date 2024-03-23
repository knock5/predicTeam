const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const app = express();

const port = 8008;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// set engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// routes
app.get("/", (req, res) => {
  res.render("home", { activePage: "home" });
});

app.get("/prediksi", (req, res) => {
  res.render("prediksi", { activePage: "prediksi" });
});

app.get("/tentang", (req, res) => {
  res.render("tentang", { activePage: "tentang" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
