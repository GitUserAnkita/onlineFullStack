const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const card = new Schema({
    // chatName: { type: String, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails' },
    card_holder: { type: String, required: true },
    card_number: { type: Number, required: true },
    cvv: { type: Number, required: true },
}, { timestamps: true }
);
const Card = mongoose.model('Card', card);
module.exports = Card;