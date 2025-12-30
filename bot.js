const mineflayer = require('mineflayer')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const collectBlock = require('mineflayer-collectblock')
const webInv = require('mineflayer-web-inventory')
const fs = require('fs')

const followSystem = require('./modules/follow')
const mineSystem = require('./modules/mine')
const dropSystem = require('./modules/drop')

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
    username: config.bot.name,
    version: config.bot.version
})

webInv(bot, {
    port: 3000
})

bot.loadPlugin(pathfinder)
bot.loadPlugin(collectBlock.plugin)

bot.once('spawn', () => {
    const mcData = require('minecraft-data')(bot.version)

    bot.movements = new Movements(bot, mcData)
    bot.pathfinder.setMovements(bot.movements)

    followSystem(bot, config)
    mineSystem(bot, config)
    dropSystem(bot, config)

    console.log(`Бот ${bot.username} подключился к серверу`)
    bot.chat(`Привет! Я - ${bot.username}. Я готов помогать тебе :3`)
})

bot.on('end', () => console.log(`Бот ${bot.username} вышел с сервера`))
bot.on('error', error => console.log(`Произошла ошибка: ${error}`))