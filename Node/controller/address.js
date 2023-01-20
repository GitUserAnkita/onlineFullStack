const Address = require('../model/address');
const mongoose = require('mongoose');
const User = require('../model/user');
var ObjectId = mongoose.Types.ObjectId

exports.addAddress = async (req, res) => {
    try {
        const body = req.body;
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "data not proper formated..." })
        } else {
            const newAddress = new Address(body);
            await newAddress.save().then(address => {
                if (!address) {
                    res.status(400).send({ message: 'address not added..!' })
                } else {
                    res.status(200).send({ message: 'address added successfully ..', data: address })
                }
            }).catch(err => {
                res.status(400).send(err)
            })
        }
    } catch (err) {
        res.status(400).send(err)
    }
}

exports.allAddress = async (req, res) => {
    try {
        await Address.find({ isDeleted: false })
            .populate([{ path: "user", select: "-password" }])
            .then((addressData) => {
                res.status(200).send({ message: "Address Data", data: addressData });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

exports.getAddress = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id) && !ObjectId(id)) {
            res.status(400).send({ message: "address id is not valid" })
        }else{
            Address.findById(id).populate([{ path: "user", select: "-password" }]).then(addressData=>{
                res.status(200).send({data:addressData})
            }).catch(err=>{
                res.status(400).send({message:'Address not found'})
            })
        }

    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.body.userId;
        const addressId = req.body.addressId;

        deletedAddressData = {
            isDeleted: true,
            deletedBy: ''
        }

        if (!ObjectId.isValid(userId)) {
            res.status(400).send({ message: "userId  is not valid" })
        }
        else if (!ObjectId.isValid(addressId)) {
            res.status(400).send({ message: "addressId  is not valid" })
        }
        else {
            const userData = await User.findById(userId);
            if (!userData) {
                res.status(400).send({ message: 'user not found' })
            }
            else {
                deletedAddressData.deletedBy = userData._id;
                const addressData = await Address.findById(addressId);
                if (!addressData) {
                    res.status(400).send({ message: 'address not found' })
                } else {
                    if (addressData.isDeleted === false) {
                        Address.findByIdAndUpdate({ _id: addressId }, deletedAddressData, { new: true }, (error, deleteAddress) => {
                            if (!deleteAddress) {
                                res.status(400).send({ message: 'Address not deleted' })
                            }
                            res.status(200).send({ message: 'Address deleted successfully' })
                        })
                    } else {
                        res.status(200).send({ message: 'Address already deleted' })
                    }
                }
            }
        }

    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};

exports.editAddress = async (req, res) => {
    try {
        const body = req.body;
        const id = req.query.id;
        const newAddress = {
            phone: body.phone,
            pincode: body.pincode,
            colony: body.colony,
            city: body.city,
            state: body.state,
            country_code: body.country_code
        }
        if (!ObjectId.isValid(id) && !ObjectId(id)) {
            res.status(400).send({ message: "please insert valid id" })
        }
        else if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "Data Not Proper Formated..." });
        } else {
            const address = await Address.findById(id);
            if (!address) {
                res.status(400).send({ message: 'address not found' })
            } else {
                Address.findByIdAndUpdate({ _id: id }, newAddress, { new: true }, (error, updatedAddress) => {
                    if (!updatedAddress) {
                        res.status(400).send({ message: 'address not updated' })
                    } else {
                        res.status(400).send({ message: 'address updated successfully' })
                    }
                })
            }
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}
