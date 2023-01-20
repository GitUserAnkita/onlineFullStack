module.exports = (app) => {
    const {
        excuteResponse,
        paypalPayment,
        successPayment,
        cancelPayment
    } = require('../controller/payment');
    const {
        verifyToken
    } = require('../middleware/authjwt')

    app.post('/checkOut', verifyToken,paypalPayment);
    app.get('/palpaySuccess',excuteResponse);
    app.get('/success',successPayment);
    app.get('/cancel',cancelPayment);
}