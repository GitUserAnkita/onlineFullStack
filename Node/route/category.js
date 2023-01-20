module.exports = (app) => {
  const {
    addCategory,
    upload,
    categories,
    getCategory,
    deleteCategory,
    updateCategory
  } = require('../controller/category');
  const express = require('express');
  const {
    verifyToken,
    webProtected
  } = require('../middleware/authjwt')
  app.use(express.static(__dirname + '/public'));
  app.use('/category', express.static('category'));

  app.post('/addCategory', verifyToken, upload.single("Image"), addCategory);
  app.get('/categories', webProtected, categories);
  app.get('/getCategory/:id', webProtected,getCategory);
  app.put('/updateCategory', upload.single("Image"), verifyToken, updateCategory);
  app.put('/deleteCategory', verifyToken, deleteCategory);
}