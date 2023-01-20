module.exports = (app)=>{
    const {
        role_type,
        getAllRoles
    } = require('../controller/role');
 const {webProtected} = require('../middleware/authjwt')
    app.post('/addRole',webProtected,role_type);
    app.get('/allRole',webProtected,getAllRoles)
}