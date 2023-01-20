module.exports = (app)=>{
    const {
        productOfferCreate,
        GetOfferProducts,
        UpdateProductoffer
    } = require('../controller/offer');
   const {
    verifyToken,
    webProtected
   } = require('../middleware/authjwt')

    app.post('/createOffer',verifyToken,productOfferCreate);
    app.get('/getAllOfferProduct',webProtected,GetOfferProducts);
    app.put('/editOffer/:id',verifyToken,UpdateProductoffer);
}