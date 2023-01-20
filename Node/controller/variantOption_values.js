const ProductValue = require('../model/variantOption_values');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.addProductValue = async (req, res) => {
    try {
        const body = req.body;
        if (Object.keys(body).length === 0 && body.construtor === Object) {
            res.status(400).send({ message: 'Data not proper formated' })
        } else {
            const variantValuedata = new ProductValue(body);
            await variantValuedata.save().then(data => {
                if (!data) {
                    res.status(400).send({ message: 'variant option value not added' });
                } else {
                    res.status(200).send({ message: 'variant option value added', data: data })
                }
            }).catch(err => {
                res.status(400).send({ message: err.message });
            })
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};

exports.allVariantValues = async (req, res) => {
    try {
        await ProductValue.find()
            .populate('product')
            .populate('variantName')
            .populate('variantOption')
            .then(productvalue => {
                if (!productvalue) {
                    res.status(400).send({ message: 'No variant values here' });
                } else {
                    res.status(200).send(productvalue)
                }
            }).catch(err => {
                res.status(400).send({ message: err.message });
            })
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

exports.updateVariantOptions = async (req, res) => {
    try {
        const body = req.body;
        const variantValueId = req.params.variantValueId;

        const variantValData = {
            product: body.product,
            variantName: body.variantName,
            variantOption: body.variantOption,
            price: body.price
        }

        if (!ObjectId.isValid(variantValueId) && !ObjectId(variantValueId)) {
            res.status(400).send({ message: "please insert valid variant Option Id" })
        }
        else if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "Data Not Proper Formated..." });
        } else {
            const updatedData = await ProductValue.findById(variantValueId);
            if (!updatedData) {
                res.status(400).send({ message: 'updated data not found' })
            } else {
                ProductValue.findByIdAndUpdate(variantValueId, variantValData, { new: true }).then(updatedata => {
                    if (!updatedata) {
                        res.status(400).send({ message: 'variant option values not updated' })
                    } else {
                        res.status(200).send({ message: 'variant option values updated successfully', updatedData: updatedata })
                    }
                })
            }
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};

exports.value = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id) && !ObjectId(id)) {
            res.status(400).send({ message: "value id is not valid" })
        } else {
            ProductValue.findById(id)
                .populate('product')
                .populate('variantName')
                .populate('variantOption')
                .then(value => {
                    if (!value) {
                        res.status(400).send({ message: 'product value not found' })
                    } else {
                        res.status(200).send({ data: value })
                    }
                }).catch(err => {
                    res.status(400).send({ message: err.message })
                })
        }

    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};