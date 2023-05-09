import * as mc from '@minecraft/server';
declare module "@minecraft/server" {
    interface Player {
        maxMana_c: number;
        currentMana_c: number;
    }
}
