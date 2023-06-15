const User = require('../models/user');
const Message = require('../models/message');

const sequelize = require('../util/database');

exports.getMessages = async (req, res) => {
    try{
        const messages = await Message.findAll({
           attributes: ['id', 'textMessage'],
           include: [
            {
                model: User,
                required: true,
                attributes: ['name']
            }
           ],
           order: ['updatedAt']
        });
        // console.log(messages);
        res.status(200).json({messages: messages});
    } catch(err) {
        console.log(err);
        res.status(500).json({err: err.message});
    }
}

exports.postMessage = async (req, res) => {
    try{
        const message = req.body.message;
        const msg = await req.user.createMessage({textMessage: message});
        res.status(201).json({success: true, textMessage: msg.textMessage, user: {name: req.user.name}})
    } catch(err){
        console.log(err);
        res.status(500).json({err: err.message});
    }
}