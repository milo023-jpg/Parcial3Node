const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Clientes endpoint funcionando" });
});

module.exports = router;
