const { GoalFollow } = require('mineflayer-pathfinder').goals

const states = require('../states')

function followSystem(bot, config) {
    bot.on('chat', async(username, message) => {
        if (username === bot.username) return
        
        const messageLower = message.toLowerCase().trim()
    
        if (config.commands.startFollow.includes(messageLower)) {
            if (states.mode !== 'nope') {
                console.log(`Состояние бота: ${states.mode}`)
                return bot.chat('Прости, но я сейчас немного занят :c')
            }

            const player = bot.players[username]
            if (!player?.entity) return bot.chat('Я тебя не вижу :c')
    
            const goal = new GoalFollow(player.entity, 2)
    
            bot.pathfinder.setGoal(goal, true)
            states.mode = 'follow'

            bot.chat('Я теперь следую за тобой')
        } else if (config.commands.stopFollow.includes(messageLower)) {
            bot.pathfinder.setGoal(null)
            states.mode = 'nope'

            bot.chat('Хорошо, я буду ждать здесь')
        }
    })
}

module.exports = followSystem