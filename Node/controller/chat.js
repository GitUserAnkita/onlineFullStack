const asyncHandler = require('express-async-handler');
const Chat = require('../model/chat');
const User = require('../model/user');

exports.createChat = asyncHandler(async (req, res) => {
    try {
        const body = req.body;
        if (body.users.length < 2) {
            res.status(400).send({
                message: 'please provide user id'
            });
        } else {
            var isChat = await Chat.find({
                $and: [
                    { users: { $elemMatch: { $eq: body.users[0] } } },
                    { users: { $elemMatch: { $eq: body.users[1] } } },  // req.user._id it will come from the token
                ]
            }).populate('users', '-password');
            console.log(isChat)
            isChat = await User.populate(isChat, {
                path: "latestMessage.sender",
                select: "name pic email",
            });

            if (isChat.length > 0) {
                Chat.find({ users: { $elemMatch: { $eq: body.createdBy } } })
                    .populate('users', '-password')
                    .populate('lastMessage')
                    .sort({ updatedAt: -1 })
                    .then(fullChat => {
                        res.status(200).send(fullChat);
                    });
            } else {
                const chatName = await User.findById(req.body.createdBy);
                var newChat = {
                    chatName: 'sender',
                    users: body.users,
                    createdBy: body.createdBy
                }
                try {
                    const chat = await Chat.create(newChat);
                    if (chat) {
                        const fullChat = await Chat.find({ users: { $elemMatch: { $eq: body.createdBy } } })
                            .populate('users', '-password')
                            .populate('lastMessage')
                            .sort({ updatedAt: -1 })
                        res.status(200).send(fullChat);
                    } else {
                        res.status(400).send({
                            message: "chat not created!",
                            subError: error.message
                        })
                    }

                } catch (error) {
                    res.status(400).send({
                        message: "chat not created!",
                        subError: error.message
                    })
                }
            }
        }

    } catch (error) {
        res.status(400).send({
            message: 'Oops! something went wrong create chat',
            subError: error.message
        })
    }

});

exports.chatList = asyncHandler(async (req, res) => {
    try{
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate('users','-password').
        populate('lastMessage')
        .sort({updatedAt:-1})
        .then(chat=>{
            if(chat.length === 0){
                res.status(200).send({message:'no chat found with this user'});
            }else{
                res.status(200).send(chat);
            }
          
        })
    }catch(error){
        res.status(400).send({
            message:"Oops something went wrong in fetch the Chat",
            subError:error.message
        })
    }
});

exports.getChat = async (req, res) => {
    try {
        if (!req.params.userid) {
            res.status(400).send({
                message: " userid is required",
                subError: req.params.userid
            })
        } else {
            await Chat.find({ users: { $elemMatch: { $eq: req.params.userid } } })
                .populate('users', '-password')
                .populate('lastMessage')
                .sort({ updatedAt: -1 })
                .then(chat => {
                    res.status(200).send(chat);
                });
        }

    } catch (error) {
        res.status(400).send({
            message: "Oops something went wrong in fetch the Chat",
            subError: error.message
        })
    }
};
