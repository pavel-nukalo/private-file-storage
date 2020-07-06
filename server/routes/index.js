const express = require('express');
const router = express.Router();

const fileRouter = require('./file');
const authRouter = require('./auth');
const userRouter = require('./user');

router.use('/file', fileRouter);
router.use(authRouter);
router.use(userRouter);

module.exports = router;