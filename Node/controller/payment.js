var paypal = require('paypal-rest-sdk');
require('dotenv').config();
const { createPaypalPayment, excute,success,cancel } = require('../payment')

exports.paypalPayment = async(req,res)=>{
    try{
          var paymentJson = {
              items : req.body.items,
              amount : req.body.amount
          }
         
        createPaypalPayment(res,res,paymentJson);
    }catch(error){
        res.status(400).send({
            message:"Oops! something went wrong in paypal make payment",
            subError:error.message
        })
    }
}

//Excute
exports.excuteResponse = async(req,res)=>{
    try{
        excute(req,res);
    }catch(error){
        res.status(400).send({
            message:"Oops! something went wrong in when excute the payment",
            subError:error.message
        })
    }
}

exports.successPayment =async(req,res) =>{
    try{
        success(req,res)
    }catch(err){
      res.status(400).send({message:err.message})
    }
}

exports.cancelPayment =async(req,res) =>{
    try{
        cancel(req,res)
    }catch(err){
      res.status(400).send({message:err.message})
    }
}