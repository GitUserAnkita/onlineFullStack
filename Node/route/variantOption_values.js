module.exports = (app) => {
    const {
        addProductValue,
        updateVariantOptions,
        allVariantValues,
        value
    } = require('../controller/variantOption_values');
    const { verifyToken, webProtected } = require('../middleware/authjwt')

    app.post('/addVariantValue', verifyToken,addProductValue);
    app.get('/allVariantValues', verifyToken,allVariantValues);
    app.put('/editVariantValues/:variantValueId', verifyToken,updateVariantOptions);
    app.get('/productValue/:id', verifyToken,value);

}