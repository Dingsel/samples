import { Container, Player, world, EntityHurtEvent, MinecraftEffectTypes } from "@minecraft/server";

//Enchantment handler
class CustomEnchant {
    static list = []
    /**
     * @param {string} enchantName
     * @param {function(EntityHurtEvent, number | string)} callback
     */
    static addHitListener(enchantName, callback) {
        this.list.push({ name: enchantName, callback: callback })
    }
}

//Testing for present enchantments and calling callbacks
world.events.entityHurt.subscribe((event) => {
    const player = event.damageSource.damagingEntity;
    if (!(player instanceof Player)) return;
    /** @type {Container} */
    const container = player.getComponent("inventory").container;
    const heldItem = container.getItem(player.selectedSlot);
    const lore = heldItem.getLore();
    for (const enchant of lore) {
        const ench = CustomEnchant.list.find((x) => enchant.startsWith(x.name));
        if (!ench) continue;
        const level = parseInt(enchant.substring(ench.name.length)) || enchant.substring(ench.name.length).trim() || 0
        ench.callback(event, level)
    }
})

//applying enchantments using the chat (Change as you like)
world.events.beforeChat.subscribe((event) => {
    const player = event.sender
    if (!(player instanceof Player)) return;
    /** @type {Container} */
    const container = player.getComponent("inventory").container;
    const heldItem = container.getItem(player.selectedSlot);
    heldItem.setLore(["explode 1", "strength 2"])
    container.setItem(player.selectedSlot, heldItem)
})


//custom explode enchantment that will explode on hit
CustomEnchant.addHitListener("explode", (hurtEvent, level) => {
    const player = hurtEvent.damageSource.damagingEntity
    player.dimension.createExplosion(player.headLocation, level)
})

//custom strength enchantment that will give strength on hit
CustomEnchant.addHitListener("strength", (hurtEvent, level) => {
    const player = hurtEvent.damageSource.damagingEntity
    player.addEffect(MinecraftEffectTypes.strength, 100, level)
})
