const express = require('express');

const msgController = require('../controllers/msgCont');
const userAuthenticate = require('../middleware/auth');

const router = express.Router();

router.post('/messages', userAuthenticate.authenticate, msgController.postMessage);

router.get('/messages', userAuthenticate.authenticate, msgController.getMessages);

module.exports = router;