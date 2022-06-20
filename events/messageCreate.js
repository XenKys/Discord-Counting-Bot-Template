const client = require("../index")
const countingModel = require("../models/counting")
const Parser = require("expr-eval").Parser

client.on("messageCreate", async (message) => {
    if (message.channel.id != client.settings.COUNTING_CHANNEL_ID || message.author.bot) return

    const countingData = await countingModel.findOne().catch((err) => console.log(err))

    let number

    try {
        number = Parser.evaluate(message.content.replace(/\\/g, ""))
    } catch {
        return
    }

    if (countingData) {
        if (message.author.id == countingData.lastUserID) {
            message.reply({
                content: "Each user can write only one number at a time"
            })
            message.react("❌")

            message.channel.send("0").then((msg) => msg.react("✅"))

            countingData.lastNumber = 0
            countingData.lastUserID = client.user.id
            countingData.lastMessageID = message.id
            countingData.save()
            return
        }

        if (number == countingData.lastNumber + 1) {
            message.react("✅")

            countingData.lastNumber = number
            countingData.lastUserID = message.author.id
            countingData.lastMessageID = message.id
            countingData.save();
        } else if (number - 1 != countingData.lastNumber) {
            message.reply({
                content: `The number you entered is incorrect, you should have entered ${countingData.lastNumber + 1}`,
            })
            message.react("❌")

            message.channel.send("0").then((msg) => msg.react("✅"))

            countingData.lastNumber = 0
            countingData.lastUserID = client.user.id
            countingData.lastMessageID = message.id
            countingData.save()
            return
        }
    } else {
        message.react("✅")

        new countingModel({
            lastNumber: number,
            lastUserID: message.author.id,
            lastMessageID: message.id
        }).save()
    }
})