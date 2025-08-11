import * as PIXI from 'pixi.js';
import { app, bombState } from './index.js';
import { sizeRect, widthField, heightField, fieldSize } from './field.js';
import { arrStone } from './stone.js';

const textureWall = await PIXI.Assets.load('/assets/textures/stone2.png');
const destroyWall = await PIXI.Assets.load('/assets/sprites/destroyWall.png');

export let arrWall = [];

export const createWall = (level) => {

    let wallX = 0;
    let wallY = 0;

    const wallContainer = new PIXI.Container();
    for (let i = 0; i < fieldSize; i++) {

        if(wallX === widthField) {
            wallY += 1;
            wallX = 0;
        }

        if (level[i] === 'wall') {

        const wall = new PIXI.Graphics();
        wall.rect(0, 0, sizeRect, sizeRect).fill({ texture: textureWall });

        wall.x = wallX * sizeRect;
        wall.y = wallY * sizeRect;

        arrWall[i] = wall;
        wallContainer.addChild(wall);
        }

        wallX += 1;
    }
    console.log(arrWall)


    wallContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    wallContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    wallContainer.zIndex = 2;

    app.stage.addChild(wallContainer);
}

export const handleWallDestroy = (bomb) => {
    for(let i = 1; i <= bombState.bombRadius; i++) {
        if (bomb.bombIndex % widthField !== widthField - 1 && arrWall[bomb.bombIndex + i] || arrStone[bomb.bombIndex + i]) {
            wallDestroy(bomb.bombIndex + i);
            break;
        }
        
    }
    
    for(let i = 1; i <= bombState.bombRadius; i++) {
        if(bomb.bombIndex % widthField !== 0 && arrWall[bomb.bombIndex - i] || arrStone[bomb.bombIndex - i]) {
            wallDestroy(bomb.bombIndex - i)
            break;
        }
    }
    
    for(let i = 1; i <= bombState.bombRadius; i++) {
        if(arrWall[bomb.bombIndex + widthField * i] || arrStone[bomb.bombIndex + widthField * i]) {
            wallDestroy(bomb.bombIndex + widthField * i)
            break;
        }
    }
    
    for(let i = 1; i <= bombState.bombRadius; i++) {
        if(arrWall[bomb.bombIndex - widthField * i] || arrStone[bomb.bombIndex - widthField * i]) {
            wallDestroy(bomb.bombIndex - widthField * i)
            break;
        }
    }
    
}

const wallDestroy = (index) => {
    if(!arrWall[index]) return;

    arrWall[index].destroy({children: true});
    arrWall[index] = undefined;
    //add animation
    const wallDestroyContainer = new PIXI.Container();
     
    const spriteDestroyWall = new PIXI.Sprite(destroyWall);
    spriteDestroyWall.width = sizeRect;
    spriteDestroyWall.height = sizeRect;
    spriteDestroyWall.x = index % widthField * sizeRect;
    spriteDestroyWall.y = Math.trunc(index / widthField) * sizeRect;

    wallDestroyContainer.addChild(spriteDestroyWall);

    setTimeout(() => {
        spriteDestroyWall.destroy({children: true})
    }, 800)

    wallDestroyContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    wallDestroyContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    wallDestroyContainer.zIndex = 2;
    app.stage.addChild(wallDestroyContainer);
}