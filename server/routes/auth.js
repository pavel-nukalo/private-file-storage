const config = require('config');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
var { check } = require('express-validator');

const userModel = require('../models/user');
const { errors } = require('../utils/validation');
const { authMiddleware } = require('../middlewares/auth.js');
const refreshTokenService = require('../services/refreshToken');

const router = express.Router();

const issueTokenPair = async ({ id, email }) => {
  const token = jwt.sign({
    id,
    email,
  }, config.get('jwt.secret'), { expiresIn: config.get('jwt.expiresIn') });

  const refreshToken = uuid();

  await refreshTokenService.add({
    userId: id,
    token: refreshToken
  });

  return { token, refreshToken };
};

router.post('/signup', [
  check('email').isEmail(),
  errors(),
], async (req, res) => {
  try {
    const email = req.body.email;
    const user = await userModel.getByEmail(email);
    if (user) {
      return res.status(403).json({
        status: false,
        message: 'User with this email is already registered.'
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, config.get('bcrypt.saltRounds'));
    const id = await userModel.insert({
      email,
      password: hashedPassword
    });

    const { token, refreshToken } = await issueTokenPair({ id, email });

    res.status(201).json({
      status: true,
      message: 'User is registered',
      token,
      refreshToken
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/signin', [
  check('email').isEmail(),
  errors(),
], async (req, res) => {
  try {
    const user = await userModel.getByEmail(req.body.email);
    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'User not found'
      });
    }

    const samePassword = await bcrypt.compare(req.body.password, user.password);
    if (!samePassword) {
      return res.status(401).json({
        status: false,
        message: 'Password is wrong'
      });
    }

    const { token, refreshToken } = await issueTokenPair(user);

    res.json({
      status: true,
      message: 'User is signed in',
      token,
      refreshToken
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/refresh-token', authMiddleware, async (req, res) => {
  try {
    const user = { id: req.decoded.id, email: req.decoded.email };

    const dbRefreshToken = await refreshTokenService.find({ token: req.body.refreshToken });
    if (!dbRefreshToken) {
      return res.status(403).json({
        status: false,
        message: 'Refresh token is invalid.'
      });
    }

    await refreshTokenService.remove({ token: dbRefreshToken.token });
    const { token, refreshToken } = await issueTokenPair(user);

    res.json({
      status: true,
      message: 'User token is refreshed',
      token,
      refreshToken
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/logout', authMiddleware, async (req, res) => {
  try {
    const { id: userId } = req.decoded;
    await refreshTokenService.remove({ userId });

    res.json({
      status: true,
      message: 'User is signed out',
    });
  } catch (e) {
    res.status(500).send(err);
  }
});

module.exports = router;