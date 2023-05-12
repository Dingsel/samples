import {
    world
} from '@minecraft/server';

let colorCodes = ['§c', '§6', '§e', '§a', '§b', '§3', '§d'];

function color(msg) {
    let color = '';
    let msgPos = 0;
    for (let i = 0; i < msg.length; i++) {
        if (msg[i] == ' ') {
            color += ' ';
            continue;
        }
        color += '' + colorCodes[msgPos % colorCodes.length] + msg[i];
        msgPos++;
    }
    return color;
}
world.events.beforeChat.subscribe(event => {
    event.message = color(event.message);
});
