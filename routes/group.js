const express = require('express');

const groupController = require('../controllers/groupCont');
const userAuthenticate = require('../middleware/auth');

const router = express.Router();

router.get('/getGroups',userAuthenticate.authenticate, groupController.getGroups);

router.get('/getMessages',userAuthenticate.authenticate, groupController.getMessages);

router.post('/createGroup',userAuthenticate.authenticate, groupController.createGroup);

router.post('/joinGroup',userAuthenticate.authenticate, groupController.joinGroup);

router.post('/addUser',userAuthenticate.authenticate, groupController.addUser);

router.get('/getUsers',userAuthenticate.authenticate,groupController.getUsers);

router.delete('/removeUser',userAuthenticate.authenticate,groupController.removeUser);

router.get('/getUsersAdmin',userAuthenticate.authenticate,groupController.getUsersAdmin);

router.post('/makeAdmin',userAuthenticate.authenticate, groupController.makeAdmin);

module.exports = router;
