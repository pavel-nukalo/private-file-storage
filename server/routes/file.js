const fs = require('fs');
const path = require('path');
const config = require('config');
const express = require('express');
const { promisify } = require('util');

const fileModel = require('../models/file');
const { authMiddleware } = require('../middlewares/auth.js');

const unlink = promisify(fs.unlink);

const router = express.Router();

router.get('/list', authMiddleware, async (req, res) => {
  try {
    const [count, files] = await Promise.all([
      fileModel.getCount(),
      fileModel.getMany(req.query.list_size, req.query.page),
    ]);

    res.json({
      count,
      files
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const file = await fileModel.get(req.params.id);

    if (!file) {
      res.status(404).json({
        status: false,
        message: 'File not found'
      });
      return;
    }

    res.json(file);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/upload', authMiddleware, async (req, res) => {
  try {
    if (!req.files) {
      res.status(400).json({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      const sampleFile = req.files.sampleFile;
      const data = {
        md5: sampleFile.md5,
        name: sampleFile.name,
        extname: path.extname(sampleFile.name),
        mimetype: sampleFile.mimetype,
        size: sampleFile.size,
        uploaded: new Date(),
      };

      data.id = await fileModel.insert(data);

      const uploadPath = path.join(config.get('filesDirectory'), data.id + data.extname);
      await new Promise((resolve, reject) => sampleFile.mv(uploadPath, err => err ? reject(err) : resolve()));

      res.status(201).json({
        status: true,
        message: 'File is uploaded',
        data
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.files) {
      res.status(400).json({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      const id = req.params.id;
      const file = await fileModel.get(id);

      const unlinkPath = path.join(config.get('filesDirectory'), file.id + file.extname);
      await unlink(unlinkPath);

      const sampleFile = req.files.sampleFile;
      const data = {
        id,
        md5: sampleFile.md5,
        name: sampleFile.name,
        extname: path.extname(sampleFile.name),
        mimetype: sampleFile.mimetype,
        size: sampleFile.size,
        uploaded: new Date()
      };

      await fileModel.update(id, data);

      const uploadPath = path.join(config.get('filesDirectory'), data.id + data.extname);
      await new Promise((resolve, reject) => sampleFile.mv(uploadPath, err => err ? reject(err) : resolve()));

      res.json({
        status: true,
        message: 'File is updated',
        data
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const file = await fileModel.get(req.params.id);

    const unlinkPath = path.join(config.get('filesDirectory'), file.id + file.extname);
    await unlink(unlinkPath);

    await fileModel.delete(file.id);

    res.json({
      status: true,
      message: 'File is deleted',
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/download/:id', authMiddleware, async (req, res) => {
  try {
    const file = await fileModel.get(req.params.id);

    if (!file) {
      return res.sendStatus(404);
    }

    const downloadPath = path.join(config.get('filesDirectory'), file.id + file.extname);
    res.download(downloadPath, file.name);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;