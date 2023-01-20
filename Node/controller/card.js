const Card = require('../model/card');
const mongoose = require('mongoose');
const { path } = require('../server');
const ObjectId = mongoose.Types.ObjectId;

exports.addCardDetails = async (req, res) => {
    try {
        const body = req.body;
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "data not proper formated..." })
        } else {
            const newCard = new Card(body);
            await newCard.save().then(cardData => {
                if (!cardData) {
                    res.status(400).send({ message: "card details not added" })
                } else {
                    res.status(200).send({ message: 'card added successfully .', data: cardData })
                }
            })
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

exports.getCardDetails = async (req, res) => {
    try {
        const cardId = req.params.cardId;
        if (!cardId) {
            res.status(400).send({ message: 'card id is required' });
        }
        else if (!ObjectId.isValid(cardId) && !ObjectId(cardId)) {
            res.status(400).send({ message: "card Id not valid" });
        } else {
            await Card.findById(cardId)
                .populate([{ path: "userId", select: "-password" }])
                .then(cardData => {
                    if (!cardData) {
                        res.status(400).send({ message: "card not found" })
                    } else {
                        res.status(200).send(cardData)
                    }
                }).catch(err => {
                    res.status(400).send({ message: err.message })
                })
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

exports.getAllCards = async (req, res) => {
    try {
        const userid = req.params.userid;
        await Card.find({userId:req.user._id}).populate([{ path: "userId", select: "-password" }]).then(allCards => {
            if (allCards.length === 0 ) {
                res.status(400).send({ message: "No cards found " })
            } else {
                res.status(200).send(allCards)
            }
        }).catch(err => {
            res.status(400).send({ message: err.message })
        })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}