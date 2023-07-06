// const io = require('socket.io')(5000)
const User = require('../models/user');
const Message = require('../models/message');

const sequelize = require('../util/database');
const { Op } = require("sequelize");
const UserGroup = require('../models/user-group');
const {uploadToS3} = require('../services/s3services');

exports.getMessages = async (req, res) => {
    try{
        let lastMsgId = req.query.lastMessageId;
        // console.log("lastMsgId in cintroller>>>",lastMsgId);
        if(lastMsgId === undefined)
            lastMsgId = 0;

        const messages = await Message.findAll({
            //attributes: ['id', 'textMessage'],
            where: {id : { [Op.gt]: lastMsgId } },
            include: [
                {
                    model: User,
                    required: true,
                    attributes: ['name']
                }
            ],
            order: ['updatedAt']
        });
        //console.log(messages);
        res.status(200).json({messages: messages});
    } catch(err) {
        console.log(err);
        res.status(500).json({err: err.message});
    }
}

exports.postMessage = async (req, res) => {
    const {groupId} = req.body;
    // console.log('BE post message>>>',req.files);
    try{
        const message = req.body.message;
        const user = await UserGroup.findOne({where: {userId: req.user.id, groupId: groupId}})
        if(user){
            const attachmentUrls = [];
            // console.log("req.file", req.files);
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    // console.log({ buffer: file.buffer, originalname: file.originalname });
                    const attachmentUrl = await uploadToS3(file.buffer, file.originalname);
                    attachmentUrls.push(attachmentUrl);
                }
            }
            const msg = await req.user.createMessage({textMessage: message||"", groupId: groupId, attachment: JSON.stringify(attachmentUrls)});
            res.status(201).json({textMessage: msg.textMessage, attachment: msg.attachment, userId: req.user.id, user: {name: req.user.name}})
        }else{
            throw new Error('User is not part of this group!!');
        }
        
    } catch(err){
        console.log(err);
        res.status(500).json({err: err.message});
    }
}