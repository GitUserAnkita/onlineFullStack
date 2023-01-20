module.exports = (app) => {
    const {
    addVariantOption,
    getAllOptions,
    updateVariantOptions
    } = require('../controller/variantOption');
    const { verifyToken ,webProtected} = require('../middleware/authjwt')
   
    app.post('/addVariantOptions',verifyToken,addVariantOption);
    app.get('/allVariantOptions',verifyToken,getAllOptions);
    app.put('/editVariantOptions/:variantOptionId',verifyToken,updateVariantOptions);
}