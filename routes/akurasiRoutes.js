const express = require("express");
const router = express.Router();

router.get("/akurasi", (req, res) => {
  res.render("akurasi", { activePage: "akurasi" });
});

module.exports = router;
