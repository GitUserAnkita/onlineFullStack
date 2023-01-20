const mongooes = require('mongoose');
const siteOption = mongooes.Schema({
   type: Map,
   of: String
}, { strict: false },
   { timestamps: true });

var SiteOption = mongooes.model("SiteMangement", siteOption);
module.exports = SiteOption;
