const User = require('../models/user');
const Message = require('../models/message');

const sequelize = require('../util/database');
const { Op } = require("sequelize");

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
    const groupId = req.query.groupId;
    // console.log("groupID from post req>>>>",groupId);
    try{
        const message = req.body.message;
        const msg = await req.user.createMessage({textMessage: message, groupId: groupId});
        res.status(201).json({success: true, textMessage: msg.textMessage, userId: req.user.id, user: {name: req.user.name}})
    } catch(err){
        console.log(err);
        res.status(500).json({err: err.message});
    }
}