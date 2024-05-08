const express = require("express");
const router = express.Router();

router.get("/:filename", (req, res) => {
  const { filename } = req.params;

  express.static(`public/${filename}`);
});

module.exports = router;
