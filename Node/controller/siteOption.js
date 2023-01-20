const SiteOption = require('../model/siteOption');
const User = require('../model/user');
const mongooes = require('mongoose');
var ObjectId = mongooes.Types.ObjectId
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./logo/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

exports.upload = multer({ storage: storage });

exports.addSiteOption = async (req, res) => {
    try {
        const body = req.body;
        body['isDeleted'] = false;
        console.log(req.files)
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "data not proper formated..." })
        }
        else {
            console.log(req.body)
            if (req.files) {
                const option = {
                    title: body.title,
                    Type: body.Type
                }
                for (var i = 0; i < req.files.length; i++) {
                    var fieldname = req.files[i].fieldname
                    option[fieldname] = req.files[i].path
                }
                const siteOptionDetails = new SiteOption(option)
                await siteOptionDetails.save()
                    .then((siteData) => {
                        res.status(200).send(siteData)
                    }).catch(err => {
                        res.status(400).send({ message: err.message })
                    })
            } else {
                const siteOptionDetails = new SiteOption(body)
                await siteOptionDetails.save()
                    .then((siteData) => {
                        res.status(200).send(siteData)
                    }).catch(err => {
                        res.status(400).send({ message: err.message })
                    })
            }
        }
    } catch (err) {
        res.status(400).send(err)
    }
}

exports.AllSiteOptions = async (req, res) => {
    try {
        await SiteOption.find({
            Type: req.body.type
        })
            .then(data => {
                res.status(200).send(data)
            })
            .catch(err => {
                res.status(400).send({ message: err.message })
            })
    } catch (err) {
        res.status(400).send(err)
    }
}

exports.deleteSiteOption = async (req, res) => {
    try {
        const userId = req.body.userId;
        const siteId = req.body.siteId;

        deletedSiteData = {
            isDeleted: true,
            deletedBy: ''
        }

        if (!ObjectId.isValid(userId)) {
            res.status(400).send({ message: "userId  is not valid" })
        }
        else if (!ObjectId.isValid(siteId)) {
            res.status(400).send({ message: "siteId  is not valid" })
        }
        else {
            const userData = await User.findById(userId);
            if (!userData) {
                res.status(400).send({ message: 'user not found' })
            }
            else {
                deletedSiteData.deletedBy = userData._id;
                const siteData = await SiteOption.findById(siteId);
                if (!siteData) {
                    res.status(400).send({ message: 'site option not found' })
                } else {
                    if (siteData.isDeleted === false) {
                        SiteOption.findByIdAndUpdate({ _id: siteId }, deletedSiteData, { new: true }, (error, deleteSiteOpt) => {
                            if (!deleteSiteOpt) {
                                res.status(400).send({ message: 'site option not deleted' })
                            }
                            res.status(200).send({ message: 'site option deleted successfully' })
                        })
                    } else {
                        res.status(200).send({ message: 'site option already deleted' })
                    }
                }
            }
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
};

exports.SiteOption = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            res.status(400).send({ message: "Site Option id is not valid" })
        } else {
            SiteOption.findById(id).then(siteData => {
                res.status(200).send({ data: siteData })
            }).catch(err => {
                res.status(400).send({ message: 'Site Option not found', subError: err.message });
            })
        }
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

