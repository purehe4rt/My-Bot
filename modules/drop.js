const { GoalNear } = require('mineflayer-pathfinder').goals

function dropSystem(bot, config) {
    bot.on('chat', async(username, message) => {
        if (username === bot.username) return

        const messageLower = message.toLowerCase().trim()

        if (config.commands.drop.find(cmd => messageLower.startsWith(cmd))) {
            const player = bot.players[username]
            if (!player?.entity) return bot.chat('Я тебя не вижу :c')

            const args = messageLower.split(' ')
            const itemName = args[1]

            if (!itemName) return bot.chat('Вот как надо: "дай <ID> <кол-во>"')

            const item = bot.inventory.findInventoryItem(itemName)
            if (!item) return bot.chat('У меня нету такого предмета :c')

            let amount = parseInt(args[2])
            if (isNaN(amount) || amount <= 0) amount = 1

            try {
                await bot.pathfinder.goto(
                    new GoalNear(
                        player.entity.position.x,
                        player.entity.position.y,
                        player.entity.position.z,
                        3
                    )
                )

                await bot.lookAt(player.entity.position.offset(0, 1.6, 0))
                await bot.toss(item.type, null, amount)
            } catch (error) {
                console.log(`Ошибка при передаче предмета: ${error}`)
                bot.chat('Произошла ошибка... (загляни в консоль)')
            }
        }
    })
}

module.exports = dropSystem