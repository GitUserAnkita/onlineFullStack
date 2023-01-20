const Category = require('../model/category');
const multer = require("multer");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const User = require('../model/user');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./category/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

exports.upload = multer({ storage: storage });

exports.addCategory = async (req, res) => {
    try {
        const body = req.body;
        let imagePath = "";
        if (req.file) {
            imagePath = req.file.path;
        }
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "data not proper formated..." })
        } else {
            const category = new Category({
                cat_name: body.cat_name,
                Image: imagePath,
                parent: body.parent
            });
            category.cat_slug = category.cat_name;
            await category.save().then(catData => {
                res.status(200).send(catData)
            }).catch(err => {
                res.status(400).send({ message: err.message });
            })
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

exports.categories = async (req, res) => {
    try {
        await Category.find({ isDeleted: false }).populate("parent").then(catData => {
            res.status(200).send(catData)
        }).catch(err => {
            res.status(400).send({ message: err.message })
        })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const catId = req.body.catId;
        const userId = req.body.userId;

        deleteCatData = {
            isDeleted: true,
            DeletedBy: ''
        }

        if (!ObjectId.isValid(userId)) {
            res.status(400).send({ message: "userId  is not valid" })
        }
        else if (!ObjectId.isValid(catId)) {
            res.status(400).send({ message: "category id is not valid" })
        }
        else {
            const userData = await User.findById(userId);
            if (!userData) {
                res.status(400).send({ message: 'user not found' })
            }
            else {
                deleteCatData.DeletedBy = userData._id;
                const catData = await Category.findById(catId);
                if (!catData) {
                    res.status(400).send({ message: 'category not found' })
                } else {
                    if (catData.isDeleted === false) {
                        Category.findByIdAndUpdate({ _id: catId }, deleteCatData, { new: true }, (error, deleteCategory) => {
                            if (!deleteCategory) {
                                res.status(400).send({ message: 'category not deleted' });
                            }
                            res.status(200).send({ message: 'category deleted successfully' });
                        })
                    } else {
                        res.status(200).send({ message: 'category already deleted' });
                    }
                }
            }
        }

    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};

exports.getCategory = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            res.status(400).send({ message: "category id is not valid" })
        } else {
            Category.findById(id).populate("parent").then(catData => {
                res.status(200).send({ data: catData })
            }).catch(err => {
                res.status(400).send({ message: 'Category not found',subError:err.message });
            })
        }

    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const body = req.body;
        const id = req.query.id;
        const newCategoryData = {
            cat_name: body.cat_name,
            Image: '',
            parent: body.parent
        }
        newCategoryData.cat_slug = newCategoryData.cat_name;
        if (!ObjectId.isValid(id) && !ObjectId(id)) {
            res.status(400).send({ message: "please insert valid id" })
        }
        else if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "Data Not Proper Formated..." });
        } else {
            let imagePath = "";
            if (req.file) {
              imagePath = req.file.path;
            }
            const categoryData = await Category.findById(id);
            if(!categoryData){
                res.status(400).send({message:'Category not found'})
            }else{
                if (req.file === undefined) {
                    newCategoryData.Image = categoryData.Image
                  } else {
                    newCategoryData.Image = imagePath
                  }
                await Category.findByIdAndUpdate(id, newCategoryData, { new: true }).then(updatedData => {
                    res.status(200).send({ message: 'category  updated successfully..', data: updatedData })
                  }).catch(err => {
                    res.status(400).send({ errMessage: "category not updated ", subError: err.message })
                  })
            }
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};