const Rating = require('../model/rating');
const Product = require('../model/product');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.addProductRating = async (req, res) => {
    try {
        const body = req.body;
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "data not proper formated..." })
        } else {
            var count = 0;
            const ratingData = new Rating(body);
            const addRaing = await ratingData.save();
            if (addRaing) {
                Rating.find({ product: body.product }).then(data => {
                    for (var i = 0; i < data.length; i++) {
                        count = count + data[i].star
                    }
                    var ratevalue = Math.round(count / data.length);
                    Product.findByIdAndUpdate(body.product, { rating: ratevalue }, { new: true }).then(data => {
                        res.status(200).send({ message: 'thanks for rating', data })
                    }).catch(err => {
                        res.status(400).send({ message: err.message })
                    })
                }).catch(err => {
                    res.status(400).send({ message: err.message })
                })
            }
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}


