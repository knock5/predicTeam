const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", { activePage: "home" });
});

module.exports = router;
