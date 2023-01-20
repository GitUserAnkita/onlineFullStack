module.exports = (app)=>{
    const {
      createShop,
      allShops,
      shop,
      editShop,
      deleteShop
    } = require('../controller/shop');
   const {
    verifyToken
   } = require('../middleware/authjwt')

    app.post('/addShop',verifyToken,createShop);
    app.get('/allShops',verifyToken,allShops);
    app.get('/shop/:shopId',verifyToken,shop);
    app.put('/editShop/:shopid',verifyToken,editShop);
    app.put('/deletShop',verifyToken,deleteShop);
}