const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const message = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },

}, { timestamps: true });
const Message = mongoose.model('Message', message);
module.exports = Message;