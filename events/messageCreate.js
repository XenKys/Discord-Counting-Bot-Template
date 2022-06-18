const client = require("../index")
const countingModel = require("../models/counting")

client.on("messageCreate", async (message) => {
    if (message.channel.id != client.settings.COUNTING_CHANNEL_ID || message.author.bot || message.content == "cos" || !["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(message.content)) return

    const countingData = await countingModel.find().catch((err) => console.log(err))

    if (countingData) {
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
    
            countingData.lastNumber = parseInt(message.content)
            countingData.lastUserID = message.author.id
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
    } else {
        message.react("✅")

        new countingModel({
            lastNumber: parseInt(message.content),
            lastUserID: message.author.id
        }).save()
    }
})