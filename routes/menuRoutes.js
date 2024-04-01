const express = require("express");
const router = express.Router();

router.get("/menu", (req, res) => {
  res.render("menu", { activePage: "prediksi" });
});

router.get("/menuWMA", (req, res) => {
  res.render("pages/pageWMA", { activePage: "prediksi" });
});

router.get("/menuES", (req, res) => {
  res.render("pages/pageES", { activePage: "prediksi" });
});

router.get("/menuLR", (req, res) => {
  res.render("pages/pageLR", { activePage: "prediksi" });
});

module.exports = router;
