module.exports = (app) => {
    const {
        FavoriteProducts,
        addFavorite,
        removeFavoriteProducts
    } = require('../controller/favorite');
    const { verifyToken ,webProtected} = require('../middleware/authjwt')
    app.post('/addFavorite', verifyToken,addFavorite);
    app.get('/FavoriteProducts',webProtected, FavoriteProducts);
    app.put('/removeFavoriteProducts', verifyToken,removeFavoriteProducts);

}