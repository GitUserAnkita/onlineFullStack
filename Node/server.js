const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const db = require('./config/dbConfig');
db();
const port = process.env.PORT || 3001 ;

app.use(cors());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send("working fine .......");
});

require('./route/role')(app);
require('./route/user')(app);
require('./route/address')(app);
require('./route/siteOption')(app);
require('./route/category')(app);
require('./route/shop')(app);
require('./route/product')(app);
require('./route/favorite')(app);
require('./route/rating')(app);
require('./route/variant')(app);
require('./route/variantOption')(app);
require('./route/variantOption_values')(app);
require('./route/cart')(app);
require('./route/offer')(app);
require('./route/order')(app);
require('./route/payment')(app)
require('./route/chat')(app);
require('./route/message')(app);
require('./route/card')(app);

app.listen(port,()=>{
    console.log(`server is ready to port on ${port}`)
})

module.exports = app;
