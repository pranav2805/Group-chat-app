const Group = require('../models/group');
const Message = require('../models/message');
const User = require('../models/user');
const UserGroup = require('../models/user-group');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');

exports.getGroups = async (req, res) => {
    try{
        // const groupDetailsArr = await UserGroup.findAll({
        //     attributes: ['userId', 'groupId'],
        //     where: { userId: req.user.id },
        //     include: [
        //     {
        //         model: Group,
        //         //required: true,
        //         attributes: ['id','name']
        //     }
        //     ],
        // })

        const userGroups = await UserGroup.findAll({
            attributes: ['userId', 'groupId', 'isAdmin'],
                where: { userId: req.user.id }
        })

        const groups = await Group.findAll();
        let userGroupDetails = [];
        for(let i=0;i<userGroups.length;i++){
            for(let j=0;j<groups.length;j++){
                if(userGroups[i].groupId === groups[j].id){
                    userGroupDetails.push({'userId': userGroups[i].userId, 'groupId': userGroups[i].groupId, 'groupName': groups[j].name, 'isAdmin': userGroups[i].isAdmin});
                    break;
                }
            }
        }
        console.log(userGroupDetails);
        res.status(200).json({success: true, group: userGroupDetails})
    } catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Something went wrong!!'});
    }
}

exports.getMessages = async(req, res) => {
    try{
        const groupId = req.query.groupId;
        const lastMessageId = req.query.lastMessageId;
        if(lastMessageId === undefined)
            lastMessageId = 0;
        const messages = await Message.findAll({
            attributes: ['id','textMessage','userId','groupId'],
            where: {groupId: groupId, id : { [Op.gt]: lastMessageId }},
            include: [
                {
                    model: User,
                    required: true,
                    attributes: ['name']
                }
            ],
            order: ['updatedAt']
        })
        console.log(messages);
        res.status(200).json({success: true, messages: messages})
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Something went wrong!!'});
    }
}

exports.createGroup = async (req, res) => {
    try{
        const groupName = req.body.groupName;
        //console.log(groupName);

        const groupDetails = await req.user.createGroup({name: groupName, createdBy: req.user.id});
        console.log(groupDetails);

        return res.status(200).json({success: true, message: 'Group created successfully', group: groupDetails})
    } catch(err){
        console.log(err);
        if(err.message === 'Validation error'){
            return res.status(500).json({success: false, message: 'Group name already exists!! Please try another name'})
        }
        res.status(500).json({success: false, message: 'Something went wrong!!'});
    }
}

exports.joinGroup = async (req, res) => {
    try{
        const groupName = req.body.groupName;
        const group = await Group.findOne({where: {name: groupName}});

        if(group){
            await UserGroup.create({userId: req.user.id, groupId: group.id, isAdmin: false});
            res.status(200).json({success: true, group: group, message: 'You successfully joined the group!!'})
        }else{
            throw new Error('Group does not exists!!');
        }

    } catch(err){
        console.log(err);
        if(err.type === 'unique violation'){
            return res.status(500).json({success: false, message: 'You are already part of this group!!'});
        }
        res.status(500).json({success: false, message: err});
    }
}

exports.addUser = async (req, res) => {
    try{
        const token = req.header('Authorization');
        const userAdmin = jwt.verify(token, process.env.SECRET_TOKEN);

        const groupId = req.query.groupId;
        const {email} = req.body;

        const admin = UserGroup.findOne({where: {userId: userAdmin.userId, groupId: groupId, isAdmin: true}})
        if(admin){
            const user = await User.findOne({where: {email: email}});
            if(user){
                await UserGroup.create({userId: user.id, groupId: groupId, isAdmin: false});
                res.status(200).json({success: true, message: 'User added successfully!!'});
            }else{
                throw new Error('User does not exists!!');
            }
        }else{
            throw new Error('You are not the admin of this group!!');
        }
    }catch(err){
        console.log(err);
        if(err.message === 'Validation error'){
            return res.status(500).json({success: false, message: 'User is already part of this group!!'});
        }
        res.status(500).json({success: false, message: err.message});
    }
}

exports.getUsers = async (req, res) => {
    try{
        const groupId = req.query.groupId;
        // const users = await UserGroup.findAll({
        //     attributes: ['userId'],
        //     where: {groupId: groupId},
        //     include: [
        //         {
        //             model: User,
        //             attributes: ['id','name']
        //         }
        //     ]
        // })
        // if(users && users.length>0){
        //     res.status(200).json({success: true, users: users});
        // }
        const usergroups = await UserGroup.findAll({
            attributes: ['userId'],
            where: {groupId: groupId}
        })

        const users = await User.findAll();
        let userDetails = [];

        for(let i=0;i<usergroups.length;i++){
            for(let j=0;j<users.length;j++){
                if(usergroups[i].userId === users[j].id){
                    userDetails.push({userId: users[j].id, name: users[j].name});
                    break;
                }
            }
        }

        if(userDetails && userDetails.length>0){
            res.status(200).json({success: true, users: userDetails});
        }

    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: err.message});
    }
}

exports.removeUser = async (req, res) => {
    try{
        const token = req.header('Authorization');
        const user = jwt.verify(token, process.env.SECRET_TOKEN);

        const userId = req.query.userId;
        const groupId = req.query.groupId;

        const admin = UserGroup.findOne({where: {userId: user.userId, groupId: groupId, isAdmin: true}})
        if(admin){
            await UserGroup.destroy({where: {userId: userId, groupId: groupId}});
            res.status(200).json({success: true, message: 'User removed successfully!!'});
        }else{
            throw new Error('You are not the admin of this group!!');
        }
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: err.message});
    }
}

exports.getUsersAdmin = async (req, res) => {
    try{
        const groupId = req.query.groupId;
        // const users = await UserGroup.findAll({
        //     attributes: ['userId'],
        //     where: {groupId: groupId},
        //     include: [
        //         {
        //             model: User,
        //             attributes: ['id','name']
        //         }
        //     ]
        // })
        // if(users && users.length>0){
        //     res.status(200).json({success: true, users: users});
        // }
        const usergroups = await UserGroup.findAll({
            attributes: ['userId'],
            where: {groupId: groupId, isAdmin: false}
        })

        const users = await User.findAll();
        let userDetails = [];

        for(let i=0;i<usergroups.length;i++){
            for(let j=0;j<users.length;j++){
                if(usergroups[i].userId === users[j].id){
                    userDetails.push({userId: users[j].id, name: users[j].name});
                    break;
                }
            }
        }

        if(userDetails && userDetails.length>0){
            res.status(200).json({success: true, users: userDetails});
        }

    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: err.message});
    }
}

exports.makeAdmin = async (req, res) => {
    try{
        const token = req.header('Authorization');
        const user = jwt.verify(token, process.env.SECRET_TOKEN);

        const {groupId, userId} = req.body;

        const admin = UserGroup.findOne({where: {userId: user.userId, groupId: groupId, isAdmin: true}})
        if(admin){
            await UserGroup.update({isAdmin: true},
                {where: {userId: userId, groupId: groupId}})

            res.status(200).json({success: true, message: 'User has been made admin of the group!!'});
        }else{
            throw new Error('You are not the admin of this group!!');
        }
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: err.message});
    }
}