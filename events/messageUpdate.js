const client = require("../index")
const countingModel = require("../models/counting")
const Parser = require("expr-eval").Parser

client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (!oldMessage || oldMessage.channel.id != client.settings.COUNTING_CHANNEL_ID) return

    const countingData = await countingModel.findOneAndUpdate().catch((err) => console.log(err))

    let oldNumber
    let newNumber

    try {
        oldNumber = Parser.evaluate(oldMessage.content)
    } catch {
        return
    }

    try {
        newNumber = Parser.evaluate(newMessage.content)

        if (oldNumber == newNumber) return
    } catch {
        return
    }

    if (!countingData || countingData && countingData.lastMessageID != newMessage.id) return

    if (oldNumber != countingData.lastNumber) return

    newMessage.reactions.removeAll()

    countingData.lastMessageID = oldMessage.id
    countingData.lastNumber = number
    countingData.lastUserID = client.user.id
    countingData.save()

    oldMessage.channel.send({
        content: `<@${oldMessage.author.id}> edited the number ${number}`
    })

    oldMessage.channel.send({
        content: number.toString()
    }).then((msg) => msg.react("✅"))
})