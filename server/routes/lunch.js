const express = require('express');
const router = express.Router();

router.get('/lunch', (req, res) => {
  res.send('lunch');
});

module.export = router;

