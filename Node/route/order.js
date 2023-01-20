module.exports = (app) => {
    const {
        createOrder,
        getAllOrders
    } = require('../controller/order');
    const {
        verifyToken
    } = require('../middleware/authjwt')

    app.post('/createOrder', verifyToken, createOrder);
    app.get('/getAllOrders',verifyToken,getAllOrders)
}