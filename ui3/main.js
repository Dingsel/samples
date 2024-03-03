import { world } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"

const ui = new ActionFormData()
    .title("Form")
    .body("")
    .button("button1")
    .button("button2")
    .button("button3");

const customUi = new ActionFormData()
    .title("Custom Form")
    .body("")
    .button("Rewards", "textures/customUi/X")
    .button("Shop", "textures/customUi/Circle")
    .button("Ban Tool", "textures/customUi/Circle")
    .button("Skins", "textures/customUi/Circle")
    .button("Skins", "textures/customUi/X")
    .button("Skins", "textures/customUi/Circle")
    .button("Skins", "textures/customUi/Circle")
    .button("Skins", "textures/customUi/Circle")
    .button("Skins", "textures/customUi/X")



world.afterEvents.itemUse.subscribe((event) => {
    const { source, itemStack } = event
    switch (itemStack.typeId) {
        case "minecraft:compass": ui.show(source); break;
        case "minecraft:clock": customUi.show(source); break;
    }
})
