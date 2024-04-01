const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/akurasi", (req, res) => {
  // file data penjualan.json
  const filePath = path.join(__dirname, "../data/penjualan.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.render("akurasi", { activePage: "akurasi", dataPenjualan: [] });
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      res.render("akurasi", {
        activePage: "akurasi",
        dataPenjualan: jsonData.data,
      });
    } catch (error) {
      console.error(error);
      res.render("akurasi", { activePage: "akurasi", dataPenjualan: [] });
    }
  });
});

module.exports = router;
