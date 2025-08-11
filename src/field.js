import * as PIXI from 'pixi.js';
import { app } from './index.js';

export const sizeRect = 80; 
export let widthField = 13;
export let heightField = 9;
export const fieldSize = widthField * heightField;
export let leftBorder;
export let rightBorder;
export let topBorder;
export let bottomBorder;

let fieldX = 0;
let fieldY = 0;
let fieldContainer;

const textureGrass = await PIXI.Assets.load('/assets/textures/grass.avif');

export const createField = () => {

    fieldContainer = new PIXI.Container();

    for(let i = 0; i < fieldSize; i++) {

        if(fieldX === widthField) {
            fieldY += 1;
            fieldX = 0;
        }

        const field = new PIXI.Graphics();
        field.rect(0, 0, sizeRect, sizeRect).fill({texture: textureGrass});
        
        field.x = fieldX * sizeRect;
        field.y = fieldY * sizeRect;
        
        fieldX += 1;
        
        fieldContainer.addChild(field);

    }

    fieldContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    fieldContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    fieldContainer.zIndex = 1;

    app.stage.addChild(fieldContainer);

    leftBorder = fieldContainer.x;
    topBorder = fieldContainer.y;
    rightBorder = leftBorder + (widthField * sizeRect) - sizeRect;
    bottomBorder = topBorder + (heightField * sizeRect) - sizeRect;

}