const ProductOffer = require("../model/offer");
const product = require("../model/product");

exports.productOfferCreate = async (req, res) => {
  try {
    const body = req.body;

    if (Object.keys(body).length === 0 && body.constructor === Object) {
      res.status(400).send({ message: "please provide the body data" });
    } else {
      const productData = await product.findById(req.body.productId);
   console.log(productData)
      if (productData.offer) {
        res.status(400).send({
          message: "product has already one offer"
        })
      }
      else if(productData.selling_price <= req.body.discountPrice) {
        res.status(400).send({
          message: "offer price will not be more then real price or equal"
        })
      } else {
        const productOffer = new ProductOffer({
          discountPrice: req.body.discountPrice,
          cat_id: req.body.cat_id,
          productId: req.body.productId,
        });

        const productofferresponse = await productOffer.save();
        console.log("productofferresponse", productofferresponse)

        var updateData = {
          offer: productofferresponse._id,
        };

        product.findByIdAndUpdate({ _id: req.body.productId }, updateData, { new: true }).populate('offer', 'discountPrice').then(data => {
          if (!data) {
            res.status(400).send({
              message: "prodcut not updated with offerd price",
              subError: err.message
            })
          } else {
            res.status(200).send({
              message: "offer created for the product",
              offerdProduct: data
            })
          }
        }).catch(err => {
          res.status(400).send({ message: err.message })
        })
      }
    }
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}


exports.GetOfferProducts = async (req, res) => {
  try {
   const productOfferdata =  await ProductOffer.find()
      .populate([{ path: "cat_id" }])
      .populate([{ path: "productId" }])
      .sort({ created_at: -1 })

      .then((response) => {
        if (response.length === 0) {
          res.status(200).send({ message: 'no offer product found' });
        } else {
          res.status(200).send(response);
        }

      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
};

exports.UpdateProductoffer = (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    ProductOffer.findByIdAndUpdate(id, body, { new: true }).then(offerupdatedData => {
      if (!offerupdatedData) {
        res.status(400).send({
          message: "offer not updated",
        })
      } else {
        res.status(400).send({
          message: "offer  updated successfully",
          data: offerupdatedData
        })
      }
    }).catch(err => {
      res.status(400).send({ message: err.message })
    })
    // (err, offerupdatedData) => {
    //   if (err) {
    //     res.status(404).json({
    //       message: "please enter correct productoffer id ",
    //       subErr: err.message,
    //     });
    //   } else {
    //     res.status(200).json({
    //       updated_user: "Product offer Updated successfully",
    //       offerupdatedData: offerupdatedData,
    //     });
    //   }
    // }

  } catch (err) {
    res.status(400).send({ message: err.message })
  }
};

exports.Deleteproductoffer = async (req, res) => {
  let ProductOffers = await ProductOffer.findById(req.params.id);
  if (!ProductOffers) {
    return res.status(500).json({
      success: false,
      message: "Product was not found",
    });
  }
  try {
    await ProductOffers.remove();
    res.status(201).json({
      success: true,
      message: "product offer deleted",
    });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
};
