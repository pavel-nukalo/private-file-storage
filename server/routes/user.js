const config = require('config');
const express = require('express');

const userModel = require('../models/user');
const { authMiddleware } = require('../middlewares/auth.js');

const router = express.Router();

router.get('/info', authMiddleware, async (req, res) => {
  try {
    const user = await userModel.get(req.decoded.id);
    res.json({
      status: 'success',
      data: user
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;