const client = require("../index")
const countingModel = require("../models/counting")

client.on("messageCreate", async (message) => {
    if (message.channel.id != client.settings.COUNTING_CHANNEL_ID || message.author.bot) return

    const countingData = await countingModel.findOne().catch((err) => console.log(err))

    if (!countingData || countingData && countingData.lastMessageID != message.id) return

    message.channel.send({
        content: `<@${message.author.id}> delete the number ${message.content}`
    })
    message.channel.send({
        content: message.content.toString()
    }).then((msg) => msg.react("✅"))
})