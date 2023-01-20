const Message = require('../model/message');
const Chat = require('../model/chat');
const user = require('../model/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

exports.sendMessage = async (req, res) => {
    try {
        const body = req.body;
        const chatId = body.chatId;
       console.log("body = ",body , "chatid = ",chatId)
        if (!body.content || !chatId) {
            res.status(400).send({
                message: "content and chatId is required!"
            })
        } else if (!ObjectId.isValid(chatId) && !ObjectId(chatId)) {
            res.status(400).send({ message: 'please insert valid chatId' });
        }
        else {
            const newMessage = {
                sender: body.sender,
                content: body.content,
                chat: chatId
            }
            var message = await Message.create(newMessage);
            message = await message.populate("chat");
            message = await message.populate('sender', 'name Image');
            message = await user.populate(message, {
                path: 'chat.users',
                select: 'name Image email'
            })
            console.log(("message = ",message))
            await Chat.findByIdAndUpdate(chatId, { lastMessage: message }, { new: true });
            res.status(200).send(message);

        }
    } catch (error) {
        res.status(400).send({
            message: "Oops ! something went wrong in send message",
            subError: error.message
        });
    }
};

exports.getAllMessages = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        if (!chatId) {
            res.status(400).send({
                message: "chat id required !"
            });
        } else {
            await Message.find({ chat: chatId }).populate('sender', 'name pic').populate('chat').then(messages => {
                res.status(200).send({ messages });
            }).catch(error => {
                res.status(400).send({
                    message: "messages not found ",
                    subError: error.message
                })
            });
        }
    } catch (error) {
        res.status(400).send({
            message: "Oops! someting went wrong in fetch messages",
            subError: error.message
        })
    }
}