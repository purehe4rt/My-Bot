const states = require('../states')

function mineSystem(bot, config) {
    bot.on('chat', async(username, message) => {
        if (username === bot.username) return
        
        const messageLower = message.toLowerCase().trim()
        const mcData = require('minecraft-data')(bot.version)
    
        if (config.commands.collect.find(cmd => messageLower.startsWith(cmd))) {
            if (states.mode !== 'nope') {
                console.log(`Состояние бота: ${states.mode}`)
                return bot.chat('Прости, но я сейчас немного занят :c')
            }

            const args = messageLower.split(' ')
            const blockName = args[1]
    
            if (!blockName) return bot.chat('Вот как надо: "собери <ID> <кол-во>"')
    
            const blockType = mcData.blocksByName[blockName]
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
                states.mode = 'mine'
                await bot.collectBlock.collect(blockObj)
            } catch (error) {
                console.log(`Ошибка при подборе блока: ${error}`)
                bot.chat('Произошла ошибка... (загляни в консоль)')
            } finally { states.mode = 'nope' }
        }
    })
}

module.exports = mineSystem