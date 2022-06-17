const client = require("../index")
const countingModel = require("../models/counting")

client.on("messageCreate", async (message) => {
    if (message.channel.id != client.settings.COUNTING_CHANNEL_ID || message.author.bot || message.content == "cos" || typeof (message.content) != "number") return

    const countingData = await countingModel.findOne().catch((err) => console.log(err))

    if (message.author.id == countingData.lastUserID) {
        message.reply({
            content: "Each user can write only one number at a time"
        })
        message.react("❌")

        message.channel.send("0").then((msg) => msg.react("✅"))

        countingData.lastNumber = 0
        countingData.lastUserID = client.user.id
        countingData.save()
        return
    }

    if (message.content == countingData.lastNumber + 1) {
        message.react("✅")

        countingData.lastNumber = message.content
        countingData.lastUser = message.author.id
        countingData.save()
    } else {
        message.reply({
            content: `The number you entered is incorrect, you should have entered ${countingData.lastNumber + 1}`
        })
        message.react("❌")

        message.channel.send("0").then((msg) => msg.react("✅"))

        countingData.lastNumber = 0
        countingData.lastUserID = client.user.id
        countingData.save()
        return
    }
})