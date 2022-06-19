const client = require("../index")
const countingModel = require("../models/counting")

client.on("messageDelete", async (message) => {
    if (message.channel.id != client.settings.COUNTING_CHANNEL_ID || message.author.bot) return

    const countingData = await countingModel.findOneAndUpdate().catch((err) => console.log(err))

    if (!countingData || countingData && countingData.lastMessageID != message.id) return

    countingData.lastMessageID = message.channel.lastMessageId
    countingData.lastNumber = parseInt(message.content)
    countingData.lastUserID = client.user.id
    countingData.save()

    message.channel.send({
        content: `<@${message.author.id}> delete the number ${message.content}`
    })
    message.channel.send({
        content: message.content.toString()
    }).then((msg) => msg.react("✅"))
})