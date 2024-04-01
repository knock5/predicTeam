const express = require("express");
const router = express.Router();

router.get("/prediksi", (req, res) => {
  res.render("prediksi", { activePage: "prediksi" });
});

module.exports = router;
