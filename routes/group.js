const express = require('express');

const groupController = require('../controllers/groupCont');
const userAuthenticate = require('../middleware/auth');

const router = express.Router();

router.get('/getGroups',userAuthenticate.authenticate, groupController.getGroups);

router.get('/getMessages',userAuthenticate.authenticate, groupController.getMessages);

router.post('/createGroup',userAuthenticate.authenticate, groupController.createGroup);

router.post('/joinGroup',userAuthenticate.authenticate, groupController.joinGroup);

module.exports = router;
