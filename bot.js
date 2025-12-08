const mineflayer = require('mineflayer')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { GoalFollow } = require('mineflayer-pathfinder').goals
const collectBlock = require('mineflayer-collectblock')
const fs = require('fs')

let config
try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
} catch (error) {
    console.log(`Ошибка при чтении конфига: ${error}`)
    process.exit(1)
}

const bot = mineflayer.createBot({
    host: config.bot.ip,
    port: config.bot.port,
    username: config.bot.name
})

bot.loadPlugin(pathfinder)
bot.loadPlugin(collectBlock.plugin)

bot.once('spawn', () => {
    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    bot.pathfinder.setMovements(movements)

    console.log(`Бот ${bot.username} подключился к серверу`)
    bot.chat(`Привет! Я - ${bot.username}. Я готов помогать тебе :3`)
})

bot.on('end', () => console.log(`Бот ${bot.username} вышел с сервера`))
bot.on('error', error => console.log(`Произошла ошибка: ${error}`))

bot.on('chat', async(username, message) => {
    if (username === bot.username) return

    const messageLower = message.toLowerCase().trim()

    if (config.commands.startFollow.includes(messageLower)) {
        const player = bot.players[username]
        if (!player?.entity) return bot.chat('Я тебя не вижу :c')

        const goal = new GoalFollow(player.entity, 2)

        bot.pathfinder.setGoal(goal, true)
        bot.chat('Я теперь следую за тобой')
    } else if (config.commands.stopFollow.includes(messageLower)) {
        bot.pathfinder.setGoal(null)
        bot.chat('Хорошо, я буду ждать здесь')
    }

    const mcData = require('minecraft-data')(bot.version)

    if (config.commands.collect.find(cmd => messageLower.startsWith(cmd))) {
        const args = messageLower.split(' ')
        const blockName = args[1]

        if (!blockName) return bot.chat('Вот как надо: "собери <ID> <кол-во>"')

        const blockType = mcData.blocksByName[args[1]]
        if (!blockType) return bot.chat('Такого блока я не знаю :c')

        let amount = parseInt(args[2])
        if (isNaN(amount) || amount <= 0) amount = 1

        const blocks = bot.findBlocks({
            matching: blockType.id,
            maxDistance: 32,
            count: amount
        })

        if (blocks.length === 0) return bot.chat('Такого блока нет поблизости...')

        const blockObj = blocks.map(pos => bot.blockAt(pos))

        try {
            await bot.collectBlock.collect(blockObj)
        } catch (error) {
            console.log(`Ошибка при подборе блока: ${error}`)
            bot.chat('Произошла ошибка... (загляни в консоль)')
        }
    }
})