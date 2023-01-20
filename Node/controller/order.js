const Order = require('../model/order');
const mongooes = require('mongoose');
const ObjectId = mongooes.Types.ObjectId


exports.createOrder = async (req, res) => {
    try {
        const body = req.body;
        const orderData = new Order({
            products: req.body.products,
            userId: req.body.userId,
            contact: req.body.contact,
            amount: req.body.amount,
            shipping_address: req.body.shipping_address
        });
        await orderData.save().then(orderdata => {
            if (!orderdata) {
                res.status(400).send({ message: 'no order create ! ' });
            } else {
                res.status(200).send({ message: 'order created ', data: orderdata });
            }
        }).catch(err => {
            res.status(400).send({ message: ' order not created ! ',errorMessage:err.message });
        })
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

exports.getAllOrders = async(req,res) =>{
    try{
        Order.find().populate({ path: "products.product" }).then(orders=>{
              if(orders.length === 0){
                res.status(200).send({
                  message:"orders not found",
                  orders:orders
                });
              }else{
                res.status(200).send({
                  message:"orders  found",
                  orders:orders
                });
              }
        }).catch(error=>{
          res.status(400).send({
            message:"can not found  all orders",
            subError: error.message
          });
        })
      }catch(error){
        res.status(400).send({
          message:"Oops something went wrong in get all orders",
          subError: error.message
        });
      }
}