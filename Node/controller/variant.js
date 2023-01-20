const Variant = require('../model/variants');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.addVariants = async (req, res) => {
    try {
        const body = req.body;
        if (Object.keys(body).length === 0 && body.construtor === Object) {
            res.status(400).send({ message: 'Data not proper formated' })
        } else {
            const variantData = new Variant(body);
            await variantData.save().then(data => {
                if (!data) {
                    res.status(400).send({ message: 'variant not added' });
                } else {
                    res.status(200).send({ message: 'variant added', data: data })
                }
            }).catch(err => {
                res.status(400).send({ message: err.message });
            })
        }

    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

exports.getAllVariants = async (req, res) => {
    try {
        await Variant.find().populate('product').then(variantData => {
            if (!variantData) {
                res.status(400).send({ message: 'No variant data here' });
            } else {
                res.status(200).send(variantData)
            }
        }).catch(err => {
            res.status(400).send({ message: err.message });
        })
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

exports.updateVariant = async (req, res) => {
    try {
        const body = req.body;
        const variantId = req.params.variantId;

        const variantData = {
            product: body.product,
            name: body.name
        }

        if (!ObjectId.isValid(variantId) && !ObjectId(variantId)) {
            res.status(400).send({ message: "please insert valid variantId" })
        }
        else if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "Data Not Proper Formated..." });
        } else {
            const updatedData = await Variant.findById(variantId);
            if (!updatedData) {
                res.status(400).send({ message: 'updated data not found' })
            } else {
                Variant.findByIdAndUpdate(variantId, variantData, { new: true }).then(updatedata => {
                    if (!updatedata) {
                        res.status(400).send({ message: 'variant not updated' })
                    } else {
                        res.status(200).send({ message: 'variant updated successfully', updatedData: updatedata })
                    }
                })
            }
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}