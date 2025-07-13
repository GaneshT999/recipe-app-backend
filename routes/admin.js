const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Admin route placeholder');
});

module.exports = router;
