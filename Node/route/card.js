module.exports = (app)=>{
    const {
     addCardDetails,
     getAllCards,
     getCardDetails
    } = require('../controller/card');
   const {
    verifyToken
   } = require('../middleware/authjwt')

   app.post('/addCardDetails',verifyToken,addCardDetails);
   app.get('/getAllCards',verifyToken,getAllCards);
   app.get('/cardDetails/:cardId',verifyToken,getCardDetails);
}