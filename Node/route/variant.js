module.exports = (app) => {
    const {
       addVariants,
       getAllVariants,
       updateVariant
    } = require('../controller/variant');
    const { verifyToken ,webProtected} = require('../middleware/authjwt')
   
    app.post('/addVariant',verifyToken,addVariants);
    app.get('/allVariants',verifyToken,getAllVariants);
    app.put('/editVariant/:variantId',verifyToken,updateVariant);
}