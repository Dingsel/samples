import { DynamicPropertiesDefinition, ItemStack, MinecraftEntityTypes, Player, system, world } from "@minecraft/server"
 
//-----------Initialisation Start-----------\\
 
//Configurable Variables
const defaultMaxMana = 100
const defaultCurrentMana = 0
 
//Custom Player Properties
Object.defineProperties(Player.prototype, {
    maxMana_c: {
        get() {
            return this.getDynamicProperty("maxMana") ?? defaultMaxMana
        },
        set(number) {
            this.setDynamicProperty("maxMana", number)
        }
    },
    currentMana_c: {
        get() {
            return this.getDynamicProperty("currentMana") ?? defaultCurrentMana
        },
        set(number) {
            this.setDynamicProperty("currentMana", Math.min(number, this.maxMana_c))
        }
    }
})
 
//Storing Data between World Loads
world.events.worldInitialize.subscribe((events) => {
    const { propertyRegistry } = events
    const def = new DynamicPropertiesDefinition()
    def.defineNumber("maxMana")
    def.defineNumber("currentMana")
    propertyRegistry.registerEntityTypeDynamicProperties(def, MinecraftEntityTypes.player)
})
 
 
//Class to Add An Item
class ManaItems {
 
    /** @type {Array<manaItem>}*/
    static itemsList = []
 
    /**
     * @param {string} itemId
     * @param {number} cost
     * @param {function({item:ItemStack,player:Player,succeeded:boolean,cost:number}):?boolean} callback 
     */
 
    static addManaItem(itemId, cost, callback) {
        this.itemsList.push({ id: itemId, cost: cost, callback: callback })
    }
}
 
/**
 * @typedef manaItem
 * @property {string} id
 * @property {number} cost
 * @property {function()} callback
 */
 
//-----------Initialisation End-----------\\
//----------------------------------------\\
//-------------Handler Start--------------\\
 
//Search for Clicked Item
world.events.beforeItemUse.subscribe((event) => {
    const { item, source: player } = event
    if (!(player instanceof Player)) return
    const manaItem = ManaItems.itemsList.find(x => x?.id == item.typeId)
    if (!manaItem) return
    const cancel = manaItem.callback({ item, player, succeeded: player.currentMana_c >= manaItem.cost, cost: manaItem.cost })
    if (cancel) event.cancel = true
})
 
//Display Current Mana
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        player.onScreenDisplay.setActionBar(`§b${player.currentMana_c}/${player.maxMana_c}`)
        if (system.currentTick % 20 == 0) player.currentMana_c++
    }
})
 
//--------------Handler End--------------\\
//----------------------------------------\\
//--------Adding Items and effects--------\\
 
//Apple That Spawns A Sheep On Use
ManaItems.addManaItem("minecraft:apple", 5, (event) => {
    const { player, item, succeeded, cost } = event
    if (succeeded) {
        player.currentMana_c -= cost
        player.dimension.spawnEntity("minecraft:sheep", player.location).nameTag = "jeb_"
    } else {
        player.sendMessage("No Mana")
        return true
    }
})
