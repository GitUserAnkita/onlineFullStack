const VariantOption = require('../model/variantsOptions');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.addVariantOption = async(req,res)=>{
    try{
      const body = req.body;
      if(Object.keys(body).length === 0 && body.construtor === Object){
        res.status(400).send({message:'Data not proper formated'})
      }else{
        const variantoptiondata = new VariantOption(body);
        await variantoptiondata.save().then(data => {
            if (!data) {
                res.status(400).send({ message: 'variant option not added' });
            } else {
                res.status(200).send({ message: 'variant option added', data: data })
            }
        }).catch(err => {
            res.status(400).send({ message: err.message });
        })
      }
    }catch(err){
        res.status(400).send({message:err.message})
    }
};

exports.getAllOptions = async(req,res) =>{
    try {
        await VariantOption.find()
        .populate('product')
        .populate('variantName')
        .then(variantData => {
            if (!variantData) {
                res.status(400).send({ message: 'No variant options here' });
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

exports.updateVariantOptions = async (req, res) => {
    try {
        const body = req.body;
        const variantOptionId = req.params.variantOptionId;

        const variantOptData = {
            product: body.product,
            variantName: body.variantName,
            optionName:body.optionName
        }

        if (!ObjectId.isValid(variantOptionId) && !ObjectId(variantOptionId)) {
            res.status(400).send({ message: "please insert valid variant Option Id" })
        }
        else if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "Data Not Proper Formated..." });
        } else {
            const updatedData = await VariantOption.findById(variantOptionId);
            if (!updatedData) {
                res.status(400).send({ message: 'updated data not found' })
            } else {
                VariantOption.findByIdAndUpdate(variantOptionId, variantOptData, { new: true }).then(updatedata => {
                    if (!updatedata) {
                        res.status(400).send({ message: 'variant options not updated' })
                    } else {
                        res.status(200).send({ message: 'variant options updated successfully', updatedData: updatedata })
                    }
                })
            }
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};
