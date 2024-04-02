const express = require("express");
const router = express.Router();
const akurasiRoutes = require("./akurasiRoutes");
const homeRoutes = require("./homeRoutes");
const menuRoutes = require("./menuRoutes");
const prediksiRoutes = require("./prediksiRoutes");
const tentangRoutes = require("./tentangRoutes");

router.get("/", homeRoutes);
router.get("/akurasi", akurasiRoutes);
router.get("/prediksi", prediksiRoutes);
router.get("/tentang", tentangRoutes);
router.get("/menu", menuRoutes);
router.get("/menuWMA", menuRoutes);
router.get("/menuES", menuRoutes);
router.get("/menuLR", menuRoutes);

module.exports = router;
