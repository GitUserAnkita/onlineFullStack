const mongoose = require('mongoose');
const category = mongoose.Schema({
    cat_name: { type: String, required: [true, "please Enter category name"] },
    cat_slug: { type: String, required: [true, "please Enter category slug"] },
    Image: { type: String, required: [true, "please upload category image"] },
    parent: { default: 0, type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isDeleted: { type: Boolean, default: 0 },
    DeletedBy :{ type: mongoose.Schema.Types.ObjectId,ref:'UserDetails' }
},
    {
        timestamps: true
    });

var Category = mongoose.model("Category", category);
module.exports = Category;