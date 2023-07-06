const express = require('express');
const multer = require("multer");
const upload = multer();

const msgController = require('../controllers/msgCont');
const userAuthenticate = require('../middleware/auth');

const router = express.Router();

router.post('/messages', userAuthenticate.authenticate, upload.any(), msgController.postMessage);

router.get('/messages', userAuthenticate.authenticate, msgController.getMessages);

module.exports = router;