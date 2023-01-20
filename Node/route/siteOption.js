module.exports = (app)=>{
    const {
        addSiteOption,
        AllSiteOptions,
        upload,
        deleteSiteOption,
        SiteOption
    } = require('../controller/siteOption');
    const { verifyToken ,webProtected}  = require('../middleware/authjwt')
    const express = require('express');
    app.use(express.static(__dirname + '/public'));
    app.use('/logo', express.static('logo'));

    app.post('/addSiteOption',verifyToken,upload.any(),addSiteOption);
    app.get('/AllSiteOptions',webProtected,AllSiteOptions);
    app.get('/SiteOption/:id',webProtected,SiteOption);
    app.put('/deleteSiteOption',verifyToken,deleteSiteOption);
}