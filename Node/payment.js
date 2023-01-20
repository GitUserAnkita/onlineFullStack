const Order = require("./model/order")
var paypal = require('paypal-rest-sdk');


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

var amount;
exports.createPaypalPayment = async (req, res, paymentJson) => {
  amount = paymentJson.amount;
  var create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": process.env.PAYPAL_SUCCESS_URL,
      "cancel_url": process.env.PAYPAL_CANCEL_URL
    },
    "transactions": [{
      "item_list": {
        "items": paymentJson.items
      },
      "amount": paymentJson.amount,
      "description": "This is the payment description."
    }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      res.status(400).send({
        message: "payment not created",
        subError: error.response
      })
    } else {

      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.status(200).send({
            redirectUrl: payment.links[i].href
          })
        }
      }
    }
  });

}


// excute response
exports.excute = async (req, res) => {
  const orderid = req.body.orderid;
  const payerId = req.body.PayerID;
  const paymentId = req.body.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": req.body.amount
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      console.log(error.response);
      res.status(400).send({
        message: "payment not excuted",
        subError: error.response
      })
    } else {
      res.status(200).send({
        message: "payment  excuted"
      })
    }
  });
}


exports.success = async (req, res) => {
  try {
    const orderid = req.body.orderid;
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": amount.currency,
          "total": amount.total
        }
      }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        // const orderDetailsCollect = {
        //   paymentMethod: payment.payer.payment_method,
        //   amount: payment.transactions[0].amount,
        //   shipping_address: payment.transactions[0].item_list.shipping_address,
        //   status: "payment done"
        // }
        // Order.findByIdAndUpdate(orderid, orderDetailsCollect, { new: true }, (error, result) => {
        //   if (error) {
        //     res.status(400).send({
        //       message: "order not updated",
        //       subError: error.message
        //     })
        //   } else {
        //     console.log("updated result", result)
        //     res.status(200).send({
        //       message: "order placed successfully ",
        //       result: result
        //     })
        //   }
        // });
        res.status(200).send({message:'payment done',payment});
      }

    })
  } catch (err) {

  }
}

exports.cancel = async (req, res) => {
  try {
    res.status(400).send({ message: 'payment canceled ' })
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}