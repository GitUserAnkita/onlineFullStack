const Favorite = require('../model/favorite');
const User = require('../model/user');
const mongooes = require('mongoose');
const ObjectId = mongooes.Types.ObjectId

exports.addFavorite = async (req, res) => {
    try {
        const body = req.body;
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: 'Data not proper formated' })
        } else {
            const fav_product = new Favorite(body);
            const allData = await Favorite.findOne({
                likeBy:body.likeBy,
                product:body.product
            });
            if(!allData){
                await fav_product.save().then(favProduct => {
                    if (!favProduct) {
                        res.status(400).send({ message: 'product not like' });
                    } else {
                        res.status(200).send({ message: 'product liked' })
                    }
                }).catch(err => {
                    res.status(400).send({ message: err.message });
                })
            }else{
                res.status(400).send({message:'you already liked this product'})
            }
            
        }
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

exports.FavoriteProducts = async(req,res) =>{
    try{
      Favorite.find({isDeleted : false})
      .populate([{ path: "likeBy", select: "-password" }])
      .populate("product")
      .then(favProduct=>{
        if(!favProduct){
            res.status(400).send({message:'No favorite product is here'})
        }else{
            res.status(200).send({data:favProduct});
        }
      }).catch(err=>{
        res.status(400).send({message:err.message});
      })
    }catch(err){
        res.status(400).send({message:err.message})
    }
}

exports.removeFavoriteProducts = async(req,res) =>{
    try{
    const favProductId = req.body.favProductId;
    const deletedData = {
        isDeleted : true,
        dislikeBy : ''
    }
    if (!ObjectId.isValid(favProductId) && !ObjectId(favProductId)) {
        res.status(400).send({ message: "favProductId  is not valid" });
    }else{
        const favData = await Favorite.findById(favProductId);
        if(!favData){
            res.status(400).send({message:'favorite product not found'})
        }else{
            deletedData.dislikeBy = favData.likeBy;
            Favorite.findByIdAndUpdate(favProductId,deletedData,{new:true}).then(disLikeProd=>{
                if(!disLikeProd){
                    res.status(400).send({message:'product not dislike'});
                }else{
                    res.status(200).send({message:'dislike product'})
                }
            }).catch(err=>{
                res.status(400).send({message:err.message});
            })
        }
    }
    }catch(err){
    res.status(400).send({message:err.message})
    }
}