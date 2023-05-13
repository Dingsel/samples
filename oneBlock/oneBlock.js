import { BlockLocation, MinecraftBlockTypes, system, world } from "@minecraft/server"

function getRandomBlock() {
    const keys = Object.keys(MinecraftBlockTypes)
    return MinecraftBlockTypes[keys[keys.length * Math.random() << 0]]
}


system.runSchedule(() => {
    const dimension = world.getDimension("overworld")
    const block = dimension.getBlock(new BlockLocation(0, 0, 0))
    if (!block || block.type != MinecraftBlockTypes.air) return
    block.setType(getRandomBlock())
})
