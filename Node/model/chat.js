const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const chat = new Schema({
    // chatName: { type: String, trim: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails' }],
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails' },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true }
);
const Chat = mongoose.model('Chat', chat);
module.exports = Chat;