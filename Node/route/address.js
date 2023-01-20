module.exports = (app)=>{
    const {
        addAddress,
        allAddress,
        deleteAddress,
        editAddress,
        getAddress
    } = require('../controller/address');
   const {
    verifyToken
   } = require('../middleware/authjwt')

    app.post('/addAddress',verifyToken,addAddress);
    app.get('/allAddress',verifyToken,allAddress);
    app.get('/getAddress/:id',verifyToken,getAddress);
    app.put('/deleteAddress',verifyToken,deleteAddress);
    app.put('/editAddress',verifyToken,editAddress);
}