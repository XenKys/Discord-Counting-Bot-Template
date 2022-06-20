const client = require("../index")
const countingModel = require("../models/counting")
const Parser = require("expr-eval").Parser

client.on("messageDelete", async (message) => {
    if (message.channel.id != client.settings.COUNTING_CHANNEL_ID || message.author.bot) return

    const countingData = await countingModel.findOneAndUpdate().catch((err) => console.log(err))

    let number

    try {
        number = Parser.evaluate(message.content)
    } catch {
        return
    }

    if (!countingData || countingData && countingData.lastMessageID != message.id) return

    countingData.lastMessageID = message.channel.lastMessageId
    countingData.lastNumber = number
    countingData.lastUserID = client.user.id
    countingData.save()

    message.channel.send({
        content: `<@${message.author.id}> delete the number ${message.content}`
    })
    
    message.channel.send({
        content: number.toString()
    }).then((msg) => msg.react("✅"))
})