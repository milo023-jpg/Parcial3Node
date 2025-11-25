const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Citas endpoint funcionando" });
});

module.exports = router;
