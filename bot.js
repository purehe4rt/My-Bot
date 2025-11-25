const mineflayer = require('mineflayer')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { GoalFollow } = require('mineflayer-pathfinder').goals

const bot = mineflayer.createBot({
    host: 'localhost',
    port: '25565',
    username: 'MyBot'
})

bot.loadPlugin(pathfinder)

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

    if (message === 'следуй за мной') {
        const player = bot.players[username]
        if (!player?.entity) return bot.chat('Я тебя не вижу :c')

        const goal = new GoalFollow(player.entity, 2)

        bot.pathfinder.setGoal(goal, true)
        bot.chat('Я теперь следую за тобой')
    } else if (message === 'стоп следовать') {
        bot.pathfinder.setGoal(null)
        bot.chat('Хорошо, я буду ждать здесь')
    }
})