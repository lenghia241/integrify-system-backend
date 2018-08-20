const express = require("express");
const path = require("path");
const router = express.Router();

// catch all to index.html
router.get("*", function(req, res) {
	res.sendFile(path.join(`${__dirname  }/../public/index.html`));
});

module.exports = router;
