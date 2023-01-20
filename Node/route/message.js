module.exports = (app)=>{
    const {
     sendMessage,
     getAllMessages
    } = require('../controller/message');
    const {verifyToken} = require('../middleware/authjwt')

    app.post('/sendMessage',verifyToken,sendMessage);
    app.get('/getAllMessages/:chatId',verifyToken,getAllMessages)
   
}