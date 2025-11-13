
//server side validation
const joi = require("joi");
joi.objectId = require('joi-objectid')(joi);

module.exports.reviewSchema = joi.object({
    review : joi.object({
        comment: joi.string().required(),
        rating : joi.number().required(),
        // author : joi.objectId().required(),
    }).required()
});

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description : joi.string().required(),
        location : joi.string().required(),
        country : joi.string().required(),
        price : joi.number().required().min(0),
        image :joi.object({
             url:  joi.string().allow("",null),
            filename: joi.string().allow("", null)
            })
    }).required()
});

