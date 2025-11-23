const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
    host: 'localhost',
    port: '25565',
    username: 'MyBot'
})

bot.once('spawn', () => {
    console.log(`Бот ${bot.username} подключился к серверу`)

    bot.chat(`Привет! Я - ${bot.username}. Я готов помогать тебе :3`)
})

bot.on('end', () => console.log(`Бот ${bot.username} вышел с сервера`))
bot.on('error', error => console.log(`Произошла ошибка: ${error}`))