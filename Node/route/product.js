module.exports = (app)=>{
    const {
        addProduct,
        upload,
        allProducts,
        getProduct,
        updateProduct,
        deleteProduct
    } = require('../controller/product');
    const express = require('express');
    const {verifyToken,webProtected} = require('../middleware/authjwt')
    app.use(express.static(__dirname + '/public'));
    app.use('/products', express.static('products'));

    app.post('/addProduct',verifyToken,upload.single("Image"),addProduct);
    app.get('/allProducts',webProtected,allProducts);     // with filter and searching
    app.get('/product/:productid',webProtected,getProduct);
    app.put('/editProduct/:productId',verifyToken,upload.single("Image"),updateProduct);
    app.put('/deletedProduct',verifyToken,deleteProduct)

}