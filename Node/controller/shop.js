const Shop = require('../model/shop');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const User = require('../model/user');

exports.createShop = async (req, res) => {
    try {
        const body = req.body;
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "data not proper formated..." })
        } else {
            const newShop = new Shop(body);
            await newShop.save().then(shopData => {
                if (!shopData) {
                    res.status(400).send({ message: 'Shop not added..!' })
                } else {
                    res.status(200).send({ message: 'Shop added successfully ..', data: shopData })
                }
            }).catch(err => {
                res.status(400).send(err)
            })
        }
    } catch (err) {
        res.status(400).send(err)
    }
};

exports.allShops = async (req, res) => {
    try {
        await Shop.find({ isDeleted: false })
            .populate([{ path: "shop_owner", select: "-password" }])
            .then((shopdata) => {
                res.status(200).send({ message: "shop Data", data: shopdata });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

exports.shop = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        if (!ObjectId.isValid(shopId)) {
            res.status(400).send({ message: "Shop id is not valid" })
        } else {
            Shop.findById(shopId).populate([{ path: "shop_owner", select: "-password" }]).then(shopdata => {
                res.status(200).send({ data: shopdata })
            }).catch(err => {
                res.status(400).send({ message: 'Shop not found' })
            })
        }

    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};

exports.editShop = async (req, res) => {
    try {
        const shopid = req.params.shopid;
        const body = req.body;
        const newShopData = {
            shop_name: body.shop_name,
            bussinessId: body.bussinessId,
            city: body.city,
            address: body.address
        }
        if (!ObjectId.isValid(shopid) && !ObjectId(shopid)) {
            res.status(400).send({ message: "please Insert valid shopid" })
        }
        else if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "Data Not Proper Formated..." });
        } else {
            await Shop.findByIdAndUpdate({ _id: shopid }, newShopData, { new: true }).then(updatedData => {
                if (!updatedData) {
                    res.status(400).send({ message: 'shop not updated' })
                }
                res.status(200).send({ message: 'shop updated successfully', data: updatedData });
            }).catch(err => {
                res.status(400).send({ message: err.message })
            })
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

exports.deleteShop = async (req, res) => {
    try {
        const userId = req.body.userId;
        const shopId = req.body.shopId;
       
        deletedShopData = {
            isDeleted: true,
            DeletedBy: ''
        }

        if (!ObjectId.isValid(userId)) {
            res.status(400).send({ message: "userId  is not valid" })
        }
        else if (!ObjectId.isValid(shopId)) {
            res.status(400).send({ message: "shopId  is not valid" })
        }
        else {
            const userData = await User.findById(userId);
            if (!userData) {
                res.status(400).send({ message: 'user not found' })
            }
            else {
                deletedShopData.DeletedBy = userData._id;
                const shopData = await Shop.findById(shopId);
                if (!shopData) {
                    res.status(400).send({ message: 'shop not found' })
                } else {
                    if (shopData.isDeleted === false) {
                        Shop.findByIdAndUpdate({ _id: shopId }, deletedShopData, { new: true }).then(dltShopData => {
                            if (!dltShopData) {
                                res.status(400).send({ message: 'Shop not deleted' })
                            } else {
                                res.status(200).send({ message: 'Shop deleted successfully' })
                            }
                        })
                    } else {
                        res.status(200).send({ message: 'Shop already deleted' })
                    }
                }
            }
        }

    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};
