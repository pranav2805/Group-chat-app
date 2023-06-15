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
           ]
        });
        //const messages = await User.findAll({include: Message, required: true})
        console.log(messages);
        res.status(200).json({messages: messages});
    } catch(err) {
        console.log(err);
        res.status(500).json({err: err.message});
    }
}

exports.postMessage = async (req, res) => {
    try{
        const message = req.body.message;
        await req.user.createMessage({textMessage: message});
        res.status(201).json({success: true, message: 'Message added successfully!!'})
    } catch(err){
        console.log(err);
        res.status(500).json({err: err.message});
    }
}