const express = require("express");
const router = express.Router();

router.get("/tentang", (req, res) => {
  res.render("tentang", { activePage: "tentang" });
});

module.exports = router;
