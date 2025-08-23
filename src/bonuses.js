import * as PIXI from 'pixi.js';
import { app, bonusMapping, bombState, gameState } from './index.js';
import { sizeRect, widthField, heightField } from './field.js';
import { createSpeedstersFromTeleport } from './enemy.js';
import { arrWall } from './wall.js';
import { arrStone } from './stone.js';
import { livesText } from './bomberman.js';
import { scoreText } from './score.js';



let bonusContainer;
let teleportRotation;
let bonuses = [];
let bonusesExplosion = [];
let bonusesBomb = [];
let bonusesHp = [];
let teleports = [];
let bonusesDestroy = [bonuses, bonusesExplosion, bonusesBomb, bonusesHp];
let teleportIndex = 0;

export const createBonus = async (level, bonus) => {
    bonusContainer = new PIXI.Container();
    let bonusExplosionIndex = 0;
    let bonusBombIndex = 0;
    let hpIndex = 0;

    const bonusExplosionSprite = await PIXI.Assets.load('assets/sprites/bonusExplosion.png');
    const bonusBombSprite = await PIXI.Assets.load('assets/sprites/bonusBomb.png');
    const teleportSprite = await PIXI.Assets.load('assets/sprites/teleport.png');
    const hpSprite = await PIXI.Assets.load('assets/sprites/lives.png');

    

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
            bonuses[bonusExplosionIndex] = bonusExplosion;
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
            bonuses[bonusBombIndex] = bonusBomb;
            bonusContainer.addChild(bonusBomb);
            placeForBonus.splice(placeForBonus.indexOf(bonusBombIndex), 1);
            console.log('index', bonusBombIndex, placeForBonus);
        }

        if(bonus[i] === bonusMapping.teleport) {
            teleportIndex = placeForBonus[getRandomInt(placeForBonus.length - 1)];
            const teleport = new PIXI.Sprite({texture: teleportSprite});
            teleport.width = sizeRect;
            teleport.height = sizeRect;
            teleport.x = (teleportIndex % widthField * sizeRect) + (sizeRect / 2);
            teleport.y = (Math.trunc(teleportIndex / widthField)) * sizeRect + (sizeRect / 2);
            teleports[teleportIndex] = teleport;
            teleport.anchor.set(0.5);
            teleportRotation = () => {teleport.rotation += 0.05};
            bonusContainer.addChild(teleport);
            placeForBonus.splice(placeForBonus.indexOf(teleportIndex), 1);
        }

        if(bonus[i] === bonusMapping.hp) {
            hpIndex = placeForBonus[getRandomInt(placeForBonus.length - 1)];
            const hp = new PIXI.Sprite({texture: hpSprite});
            hp.width = sizeRect;
            hp.height = sizeRect;
            hp.x = hpIndex % widthField * sizeRect;
            hp.y = (Math.trunc(hpIndex / widthField)) * sizeRect;
            bonusesHp[hpIndex] = hp;
            bonuses[hpIndex] = hp;
            bonusContainer.addChild(hp);
            placeForBonus.splice(placeForBonus.indexOf(hpIndex), 1);
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
    getBonusHp(bombermen);
    getTeleport(bombermen);
}

export const getBonusExplosion = (bombermen) => {
    if(bonusesExplosion[bombermen.currentIndex]) {
        console.log('getiing bonus')
        bonusesExplosion[bombermen.currentIndex].destroy({children: true})
        bonusesExplosion[bombermen.currentIndex] = undefined;
        bonuses[bombermen.currentIndex] = undefined;
        bombState.explosionSize += 2;
        bombState.bombRadius += 1;
        gameState.score += 200;
        scoreText.text = `Score: ${gameState.score}`;
    }
};

export const getBonusBomb = (bombermen) => {
    if(bonusesBomb[bombermen.currentIndex]) {
        bonusesBomb[bombermen.currentIndex].destroy({children: true});
        bonusesBomb[bombermen.currentIndex] = undefined;
        bonuses[bombermen.currentIndex] = undefined;
        bombState.bombAmount += 1;
        gameState.score += 200;
        scoreText.text = `Score: ${gameState.score}`;
    }
}

export const getBonusHp = (bombermen) => {
    if(bonusesHp[bombermen.currentIndex]) {
        bonusesHp[bombermen.currentIndex].destroy({children: true});
        bonusesHp[bombermen.currentIndex] = undefined;
        bonuses[bombermen.currentIndex] = undefined;
        gameState.livesAmount += 1;
        livesText.text = `= ${gameState.livesAmount}`;
        gameState.score += 200;
        scoreText.text = `Score: ${gameState.score}`;
    }
}

export const getTeleport = (bombermen) => {
    if(teleports[bombermen.currentIndex] && gameState.teleportActive) {
        console.log('New level start');
        teleports[bombermen.currentIndex].destroy({children: true})
        teleports[bombermen.currentIndex] = undefined;
        gameState.startLevel2 = true;
        gameState.level += 1;
    }
}

export const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

export const teleportActive = () => {
    if (gameState.teleportActive) {
        app.ticker.add(teleportRotation);
    }
    else {
        app.ticker.remove(teleportRotation);
    }
}

export const handleBonusDestroy = (bomb) => {
        for(let i = 1; i <= bombState.bombRadius; i++) {
            if (Math.floor((bomb.bombIndex + i) / widthField) !== Math.floor(bomb.bombIndex / widthField) || arrWall[bomb.bombIndex + i] || arrStone[bomb.bombIndex + i]) break; 
    
            if (bonuses[bomb.bombIndex + i] && !arrWall[bomb.bombIndex + i]) {
                bonuses[bomb.bombIndex + i].destroy({children: true});
                bonusesDestroy.forEach(arr => arr[bomb.bombIndex + i] = undefined);
            }
        }
        for(let i = 1; i <= bombState.bombRadius; i++) {
            if (Math.floor((bomb.bombIndex - i) / widthField) !== Math.floor(bomb.bombIndex / widthField) || arrWall[bomb.bombIndex - i] || arrStone[bomb.bombIndex - i]) break;
    
            if(bonuses[bomb.bombIndex - i] && !arrWall[bomb.bombIndex - i]) {
                bonuses[bomb.bombIndex - i].destroy({children: true});
                bonusesDestroy.forEach(arr => arr[bomb.bombIndex - i] = undefined);
            }
        }
        for(let i = 1; i <= bombState.bombRadius; i++){
            if (arrWall[bomb.bombIndex + widthField * i] || arrStone[bomb.bombIndex + widthField * i]) break;
    
            if(bonuses[bomb.bombIndex + widthField * i] && !arrWall[bomb.bombIndex + widthField * i]) {
                bonuses[bomb.bombIndex + widthField * i].destroy({children: true});
                bonusesDestroy.forEach(arr => arr[bomb.bombIndex + widthField * i] = undefined)
            }
        }
        for(let i = 1; i <= bombState.bombRadius; i++){
            if (arrWall[bomb.bombIndex - widthField * i] || arrStone[bomb.bombIndex - widthField * i]) break;
    
            if(bonuses[bomb.bombIndex - widthField * i] && !arrWall[bomb.bombIndex - widthField * i]) {
                bonuses[bomb.bombIndex - widthField * i].destroy({children: true});
                bonusesDestroy.forEach(arr => arr[bomb.bombIndex - widthField * i] = undefined);
            }
        }
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
    teleports.length = 0;
}

