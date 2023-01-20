module.exports = (app)=>{
    const {
        addProductRating
    } = require('../controller/rating');
    const {verifyToken} = require('../middleware/authjwt')
    app.post('/addRating',verifyToken,addProductRating)
    
}