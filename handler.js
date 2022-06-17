const DiscordJS = require("discord.js")
const mongo = require("mongoose")
const { promisify } = require("util")
const { glob } = require("glob")

const globPromise = promisify(glob)

/**
* @param {DiscordJS.Client} client
*/
module.exports = async (client) => {
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`)
    eventFiles.map((value) => require(value))

    mongo.connect(client.settings.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("Connected to the database Mongo DB"))
}