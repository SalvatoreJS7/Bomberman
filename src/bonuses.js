import * as PIXI from 'pixi.js';
import { app, bonusMapping, bombState } from './index.js';
import { sizeRect, widthField, heightField } from './field.js';


const bonusExplosionSprite = await PIXI.Assets.load('/assets/sprites/bonusExplosion.png');
const bonusBombSprite = await PIXI.Assets.load('/assets/sprites/bonusBomb.png');

let bonusesExplosion = [];
let bonusesBomb = [];

export const createBonus = (level, bonus) => {
    const bonusContainer = new PIXI.Container();
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
    }

    bonusContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    bonusContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    bonusContainer.zIndex = 1.5;
    app.stage.addChild(bonusContainer);
}


export const getBonus = (bombermen) => {
    getBonusExplosion(bombermen);
    getBonusBomb(bombermen);
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

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}