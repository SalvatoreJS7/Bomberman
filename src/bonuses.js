import * as PIXI from 'pixi.js';
import { app, bonusMapping, bombState, gameState } from './index.js';
import { sizeRect, widthField, heightField } from './field.js';
import { createSpeedstersFromTeleport } from './enemy.js';
import { arrWall } from './wall.js';


const bonusExplosionSprite = await PIXI.Assets.load('/assets/sprites/bonusExplosion.png');
const bonusBombSprite = await PIXI.Assets.load('/assets/sprites/bonusBomb.png');
const teleportSprite = await PIXI.Assets.load('/assets/sprites/teleport.png');

let bonusContainer;
let bonusesExplosion = [];
let bonusesBomb = [];
let teleports = [];
let teleportIndex = 0;

export const createBonus = (level, bonus) => {
    bonusContainer = new PIXI.Container();
    let bonusExplosionIndex = 0;
    let bonusBombIndex = 0;
    

    const placeForBonus = [];
    for(let i = 0; i < level.length; i++) {
        if(level[i] === 'wall') {
            placeForBonus.push(i);
        }
    }

    for(let i = 0; i < bonus.length; i++) {
        if(bonus[i] === bonusMapping.explosionPlus) {
            bonusExplosionIndex = placeForBonus[getRandomInt(placeForBonus.length - 1)];
            const bonusExplosion = new PIXI.Sprite({texture: bonusExplosionSprite});
            bonusExplosion.width = sizeRect;
            bonusExplosion.height = sizeRect;
            bonusExplosion.x = bonusExplosionIndex % widthField * sizeRect;
            bonusExplosion.y = Math.trunc(bonusExplosionIndex / widthField) * sizeRect;
            console.log(Math.trunc(bonusExplosionIndex / widthField)) * sizeRect;
            console.log('index', bonusExplosionIndex, placeForBonus);
            bonusesExplosion[bonusExplosionIndex] = bonusExplosion;
            bonusContainer.addChild(bonusExplosion);
            placeForBonus.splice(placeForBonus.indexOf(bonusExplosionIndex), 1);
        }

        if(bonus[i] === bonusMapping.bombPlus) {
            bonusBombIndex = placeForBonus[getRandomInt(placeForBonus.length - 1)];
            const bonusBomb = new PIXI.Sprite({texture: bonusBombSprite});
            bonusBomb.width = sizeRect;
            bonusBomb.height = sizeRect;
            bonusBomb.x = bonusBombIndex % widthField * sizeRect;
            bonusBomb.y = (Math.trunc(bonusBombIndex / widthField)) * sizeRect;
            console.log(Math.trunc(bonusBombIndex / widthField)) * sizeRect;
            bonusesBomb[bonusBombIndex] = bonusBomb;
            bonusContainer.addChild(bonusBomb);
            placeForBonus.splice(placeForBonus.indexOf(bonusBombIndex), 1);
            console.log('index', bonusBombIndex, placeForBonus);
        }

        if(bonus[i] === bonusMapping.teleport) {
            teleportIndex = placeForBonus[getRandomInt(placeForBonus.length - 1)];
            const teleport = new PIXI.Sprite({texture: teleportSprite});
            teleport.width = sizeRect;
            teleport.height = sizeRect;
            teleport.x = teleportIndex % widthField * sizeRect;
            teleport.y = (Math.trunc(teleportIndex / widthField)) * sizeRect;
            teleports[teleportIndex] = teleport;
            bonusContainer.addChild(teleport);
            placeForBonus.splice(placeForBonus.indexOf(teleportIndex), 1);
        }
    }

    bonusContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    bonusContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    bonusContainer.zIndex = 1.5;
    app.stage.addChild(bonusContainer);
}


export const getBonus = (bombermen) => {
    getBonusExplosion(bombermen);
    getBonusBomb(bombermen);
    getTeleport(bombermen);
}

export const getBonusExplosion = (bombermen) => {
    
    
    if(bonusesExplosion[bombermen.currentIndex]) {
        console.log('getiing bonus')
        bonusesExplosion[bombermen.currentIndex].destroy({children: true})
        bonusesExplosion[bombermen.currentIndex] = undefined;
        bombState.explosionSize += 2;
        bombState.bombRadius += 1;
    }
};

export const getBonusBomb = (bombermen) => {
    if(bonusesBomb[bombermen.currentIndex]) {
        bonusesBomb[bombermen.currentIndex].destroy({children: true});
        bonusesBomb[bombermen.currentIndex] = undefined;
        bombState.bombAmount += 1;
    }
}

export const getTeleport = (bombermen) => {
    if(teleports[bombermen.currentIndex] && gameState.teleportActive) {
        console.log('New level start');
        teleports[bombermen.currentIndex].destroy({children: true})
        teleports[bombermen.currentIndex] = undefined;
        gameState.startLevel2 = true;
    }
}

export const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

export const heandleTeleportExplosion = (bomb) => {
    for(let i = 1; i <= bombState.bombRadius; i++) {
        if(bomb.bombIndex % widthField !== widthField - 1 && teleports[bomb.bombIndex + i] && !arrWall[bomb.bombIndex + i] && !gameState.teleportActive) {
           setTimeout(() => {
             createSpeedstersFromTeleport(teleportIndex);
           }, 200)
        }
        if(bomb.bombIndex % widthField !== 0 && teleports[bomb.bombIndex - i] && !arrWall[bomb.bombIndex - i] && !gameState.teleportActive) {
            setTimeout(() => {
             createSpeedstersFromTeleport(teleportIndex);
           }, 200)
        }
        if(teleports[bomb.bombIndex + widthField * i] && !arrWall[bomb.bombIndex + widthField * i] && !gameState.teleportActive) {
            setTimeout(() => {
             createSpeedstersFromTeleport(teleportIndex);
           }, 200)    
        }
        if(teleports[bomb.bombIndex - widthField * i] && !arrWall[bomb.bombIndex - widthField * i] && !gameState.teleportActive) {
            setTimeout(() => {
             createSpeedstersFromTeleport(teleportIndex);
           }, 200)     
        }
    }
}

export const clearBonus = () => {
    bonusContainer.removeChildren().forEach((bonus) => {
        bonus.destroy({children: true})
    })
}

