const mongo = require("mongoose");

module.exports = mongo.model(
    "counting",
    new mongo.Schema({
        lastNumber: Number,
        lastUserID: String,
        lastMessageID: String
    })
);