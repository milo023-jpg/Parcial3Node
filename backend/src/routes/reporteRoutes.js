const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Reportes endpoint funcionando" });
});

module.exports = router;
