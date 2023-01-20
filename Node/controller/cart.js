const Cart = require("../model/cart");
const User = require("../model/user");
const Product = require("../model/product")
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
exports.addToCart = async (req, res) => {
    try {

        const body = req.body;
        var cartdata = {
            user: body.user,
            cart: body.cart
        }
        var wrongQuantityArray = [];
        var rightQuantityArray = [];
        const cart = await Cart.findOne({ user: body.user });
        console.log(cart)
        for (var i = 0; i < body.cart.length; i++) {
            const productData = await Product.findById(body.cart[i].product);
            if (productData.quantity < body.cart[i].quantity) {
                wrongQuantityArray.push(productData._id)
            }
        }
        if (wrongQuantityArray.length !== 0) {
            res.status(400).send({ message: `quantity is not sufficent on this product` })
        }
        else {
            checkCard(body.user).then(existCard => {
                if (!existCard.status) {
                    addproductNoExistCard(cartdata).then(cartdata => {
                        res.status(200).send(cartdata)
                    })
                } else {
                    for (var i = 0; i < body.cart.length; i++) {
                        addproductWithExistCard(existCard.cardid, body.cart[i].product, body.cart[i].quantity).then(cartdata => {
                            res.status(200).send({ message: "product added in existing cart " })
                        })
                    }
                }
            }).catch(error => {
                res.status(400).send({
                    message: "could not check card exist or not ",
                    subError: error.message
                })
            })
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

exports.getCartDetails = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        if (!ObjectId.isValid(cartId)) {
            res.status(400).send({ message: "cart id is not valid" });
        }
        else if (!cartId) {
            res.status(400).send({ message: 'cart id is required.' });
        } else {
            await Cart.findById(cartId)
            .populate([{ path: "user", select: "-password" }])
            .populate([{ path: "cart.product", select: "-quantity" }])
            .then(cartData => {
                if (!cartData) {
                    res.status(400).send({ message: 'no cart data found..' });
                } else {
                    res.status(200).send(cartData)
                }
            })
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

exports.removeProductFromCart = async (req, res) => {
    try {
        const body = req.body;
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({
                message: "body required with key"
            })
        }
        if (!ObjectId.isValid(body.cartid) && !ObjectId(body.product)) {
            res.status(400).send({
                message: "product id is not valid"
            })
        }
        if (!ObjectId.isValid(body.product) && !ObjectId(body.user)) {
            res.status(400).send({
                message: "user id is not valid"
            })
        }
        Cart.findByIdAndUpdate(body.cartid, { $pull: { [`cart`]: { product: body.product } } }, { new: true }, (error, result) => {
            if (error) {
                res.status(400).send({
                    message: "product not removed",
                    subError: error.message
                })
            } else {
                if (result === null) {
                    res.status(400).send({
                        message: "cart not found",
                        subError: error.message
                    })
                }
                res.status(200).send({
                    message: "product removed from the cart",
                })
            }
        }).populate({ path: "cart.product" });

    } catch (error) {
        res.status(400).send({
            message: "Oops! something went wrong when removing the product from the cart",
            subError: error.message
        })
    }
}



















async function checkCard(userid) {
    var isCardExist;
    await Cart.find({ user: userid }).then(alreadyCart => {
        if (alreadyCart.length === 0) {
            isCardExist = {
                status: false
            }
        } else {
            isCardExist = {
                status: true,
                cardid: alreadyCart[0]._id
            }
        }
    }).catch(error => {
        isCardExist = {
            status: false
        }
    })
    return isCardExist

}

async function addproductNoExistCard(cartdata) {
    try {
        console.log("cartdata", cartdata)
        var addedProduct;
        const cart = new Cart(cartdata);
        await cart.save().then(productsInCart => {
            if (!productsInCart) {
                addedProduct = {
                    message: "product not added in cart",
                    subError: error.message
                }
            } else {
                addedProduct = {
                    message: "product added in cart",
                    productsInCart: productsInCart
                }
            }
        }).catch(error => {
            addedProduct = {
                message: "product not added in cart",
                subError: error.message
            }
        })
    } catch (error) {
        addedProduct = {
            message: "product not added in cart",
            subError: error.message
        }
    }
    return addedProduct
}

async function addproductWithExistCard(cartId, productId, quantity) {
    var addedProduct;
    var updatedquantity;
    var b = {};
    try {
        isProductExist(cartId, productId).then(cartData => {
            if (cartData.status) {
                updatedquantity = quantity
                var a = `cart.${cartData.index}.quantity`
                b[a] = updatedquantity
                Cart.updateOne({ _id: cartId }, { $set: b }, { new: true }).catch(error => {
                    if (!error) {
                        addedProduct = {
                            message: "product not added in cart",
                            subError: error
                        }
                    }
                })

            } else {
                Cart.updateOne({ _id: cartId }, { $push: { [`cart`]: { product: productId, quantity: quantity } } }, { new: true }).catch(error => {
                    if (!error) {
                        addedProduct = {
                            message: "product not added in cart",
                            subError: error
                        }
                    }
                })
            }
        })
    } catch (error) {
        return {
            message: "product not added in cart",
            subError: error.message
        }
    }
    return addedProduct
}

async function isProductExist(cartId, producid) {
    var productExist;
    try {
        await Cart.findById(cartId).then(cartData => {
            const requiredIndex = cartData.cart.findIndex(el => {
                return JSON.stringify(el.product) === JSON.stringify(producid)
            });
            if (requiredIndex === -1) {
                productExist = {
                    status: false
                }
            } else {
                productExist = {
                    status: true,
                    productinfo: cartData.cart[requiredIndex],
                    index: requiredIndex
                }
            }
        }).catch(error => {
            productExist = error
        })
    } catch (error) {
        productExist = error
    }
    return productExist
}
