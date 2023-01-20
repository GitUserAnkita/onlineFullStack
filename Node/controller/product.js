const Product = require('../model/product');
const User = require('../model/user');
const multer = require('multer');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./products/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})
exports.upload = multer({ storage: Storage });

exports.addProduct = async (req, res) => {
    try {
        const body = req.body;
        let productImg = ''
        if (req.file) {
            productImg = req.file.path
        }
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "data not proper formated..." })
        } else {
            const productdata = {
                name: body.name,
                category: body.category,
                Image: productImg,
                product_owner: body.product_owner,
                offer: body.offer,
                selling_price: body.selling_price,
                quantity: body.quantity,
                size: body.size,
                color: body.color,
                material: body.material,
                status: body.status,
                description: body.description,
                shoe_name: body.shoe_name,
                rating: body.rating,
            }
            const product = new Product(productdata);
            await product.save().then(productData => {
                if (!productData) {
                    res.status(400).send({ message: 'product not added' });
                } else {
                    res.status(200).send({ message: 'product added successfully', data: productData })
                }
            }).catch(err => {
                res.status(400).send({ message: err.message });
            });
        }
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

exports.allProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const filters = req.query;
        const filteredProducts = products.filter(product => {
            let isValid = true;
            for (key in filters) {
                console.log(key, product[key], filters[key]);
                isValid = isValid && product[key] == filters[key];
            }
            return isValid;
        });
        res.send(filteredProducts);

    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};

exports.getProduct = async (req, res) => {
    try {
        const productid = req.params.productid;
        var count = 0
        var updateproductData = {
            visiteCount: ''
        };
        if (!ObjectId.isValid(productid) && !ObjectId(productid)) {
            res.status(400).send({ message: "productid id not valid" });
        }
        if (!productid) {
            res.status(400).send({
                message: "product id is required "
            })
        } else {
            await Product.findById(productid).then(preData => {
                if (!preData) {
                    res.status(200).send({
                        message: "product is not there "
                    })
                } else {
                    count = preData.visiteCount;
                    updateproductData.visiteCount = count + 1
                    Product.findByIdAndUpdate(productid, updateproductData, { new: true })
                        .populate([{ path: "product_owner", select: "-password" }])
                        .populate("offer")
                        .populate("category")
                        .populate("shoe_name")
                        .then(updatedData => {
                            if (!updatedData) {
                                res.status(200).send({
                                    message: "product is not here"
                                })
                            } else {
                                res.status(200).send({
                                    data: updatedData
                                })
                            }
                        })
                }
            }).catch(error => {
                res.status(400).send({
                    message: "no previous data found",
                    subError: error.message
                })
            })
        }
    } catch (error) {
        res.status(400).send({
            message: "Oops! something went wrong in visit",
            subError: error.message
        })
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const body = req.body;
        const produtId = req.params.productId;

        let productImg = ''
        if (req.file) {
            productImg = req.file.path
        }

        if (!ObjectId.isValid(produtId) && !ObjectId(produtId)) {
            res.status(400).send({ message: "please Insert valid produtId" })
        }
        else if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "Data Not Proper Formated..." });
        } else {
            const newProductData = {
                name: body.name,
                category: body.category,
                Image: '',
                offer: body.offer,
                selling_price: body.selling_price,
                quantity: body.quantity,
                size: body.size,
                color: body.color,
                material: body.material,
                status: body.status,
                description: body.description,
            }

            const productData = await Product.findById(produtId);
            if (!productData) {
                res.status(400).send({ message: 'product not found' })
            } else {
                if (req.file === undefined) {
                    newProductData.Image = productData.Image
                } else {
                    newProductData.Image = productImg
                }
                Product.findByIdAndUpdate(produtId, newProductData, { new: true }).then(updatedPro_data => {
                    if (!updatedPro_data) {
                        res.status(400).send({ message: 'product not updated' });
                    } else {
                        res.status(400).send({ message: "product updated succesfully", data: updatedPro_data });
                    }
                }).catch(err => {
                    res.status(400).send({ message: err.message });
                })
            }
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const body = req.body;

        const userId = body.userId;
        const productId = body.productId;

        const deleteProductData = {
            isDeleted: true,
            deletedBy: ''
        }
        if (!ObjectId.isValid(productId) && !ObjectId(productId)) {
            res.status(400).send({ message: "productid id not valid" });
        }
        else if (!ObjectId.isValid(userId) && !ObjectId(userId)) {
            res.status(400).send({ message: "userId not valid" });
        } else {
            const userData = await User.findById(userId);
            if(!userData){
                res.status(400).send({message:'user not found'})
            }else{
                deleteProductData.deletedBy = userData._id;
                const product = await Product.findById(productId);
                if(!product){
                    res.status(400).send({message:'product not found'})
                }else{
                    if(product.isDeleted === false){
                        Product.findByIdAndUpdate(productId,deleteProductData,{new:true}).then(updatedData=>{
                            if(!updatedData){
                                res.status(400).send({message:'product not deleted'})
                            }else{
                                res.status(400).send({message:'product deleted successfully',data:updatedData})
                            }
                        }).catch(err=>{
                            res.status(400).send({message:err.message})
                        })
                    }else{
                        res.status(400).send({message:'product already deleted'})
                    }
                }
            }
        }

    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}