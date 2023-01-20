module.exports = (app)=>{
    const {
        createChat,
        chatList,
        getChat
    } = require('../controller/chat');
    const {verifyToken} = require('../middleware/authjwt')

    app.post('/InitiateChat',verifyToken,createChat);
    app.get('/chatList',verifyToken,chatList)
    app.get('/chat/:userid',verifyToken,getChat)
}