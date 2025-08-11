import * as PIXI from 'pixi.js';
import { app } from './index.js';
import { sizeRect, widthField, heightField, fieldSize } from './field.js';

const textureStone = await PIXI.Assets.load('/assets/sprites/stone3.jpg');

export let arrStone = [];

export const createStone = (level) => {

    let stoneX = 0;
    let stoneY = 0;

    const stoneContainer = new PIXI.Container();
     for(let i = 0; i < fieldSize; i++) {

        if(stoneX === widthField) {
            stoneY += 1;
            stoneX = 0;
        }

        if(level[i] === 'stone') {
            const stone = new PIXI.Graphics();
            stone.rect(0, 0, sizeRect, sizeRect).fill({texture: textureStone});

            stone.x = stoneX * sizeRect;
            stone.y = stoneY * sizeRect;

            
            arrStone[i] = stone;
            stoneContainer.addChild(stone);
        }

        stoneX += 1;
    }
    stoneContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    stoneContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    stoneContainer.zIndex = 2;
    app.stage.addChild(stoneContainer);

} 

