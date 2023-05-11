import { world } from '@minecraft/server';
let colorCodes = ["§c", "§6", "§e", "§a", "§b", "§3", "§d"];

/**
 * @param {string} msg - The Input String
 * @returns {string} - The Colored Return String
 */
function color(msg) {
    let message = "";
    let length = 0;
    for (let i = 0; i < msg.length; i++) {
        if (msg[i] == " ") {
            message += " ";
            continue;
        }
        message += `${colorCodes[length % colorCodes.length]}${msg[i]}`;
        length++;
    }
    return message;
}

world.events.beforeChat.subscribe(data => {
    data.message = color(data.message);
});
