module.exports = (app)=>{
    const {
        addToCart,
        getCartDetails,
        removeProductFromCart
    } = require('../controller/cart');
   const {
    verifyToken
   } = require('../middleware/authjwt')

    app.post('/addToCart',verifyToken,addToCart);
    app.get('/viewCart/:cartId',verifyToken,getCartDetails); 
    app.delete("/removeProductOfCart",verifyToken,removeProductFromCart);
}