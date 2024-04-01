const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const homeRoutes = require("./routes/homeRoutes");
const akurasiRoutes = require("./routes/akurasiRoutes");
const prediksiRoutes = require("./routes/prediksiRoutes");
const tentangRoutes = require("./routes/tentangRoutes");
const menuRoutes = require("./routes/menuRoutes");
const app = express();

const port = 8008;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// set engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// routes
app.get("/", homeRoutes);
app.get("/akurasi", akurasiRoutes);
app.get("/prediksi", prediksiRoutes);
app.get("/tentang", tentangRoutes);
app.get("/menu", menuRoutes);
app.get("/menuWMA", menuRoutes);
app.get("/menuES", menuRoutes);
app.get("/menuLR", menuRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
