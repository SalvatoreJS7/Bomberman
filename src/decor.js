import * as PIXI from 'pixi.js';
import { app } from './index.js';
import { sizeRect, widthField } from './field.js';
import { bombermen } from './bomberman.js';

let decorContainer;
let decorTicker;

export const createDecor = async () => {
    const decorSprite1 = await PIXI.Assets.load('assets/sprites/joystick.png');
    const decorSprite2 = await PIXI.Assets.load('assets/sprites/supernintendo.png');

    decorContainer = new PIXI.Container();
    const decor1 = new PIXI.Sprite(decorSprite1);
    const decor2 = new PIXI.Sprite(decorSprite2);
   
    decor1.width = 200
    decor1.height = 100 
    decor2.width = 200
    decor2.height = 130 
    decor1.position.x = (bombermen.position.x - decor1.width) / 2;
    decor1.position.y = (widthField * sizeRect - decor1.height) / 2;
    decor2.position.x = (bombermen.position.x - decor1.width) / 2;
    decor2.position.y = bombermen.y;

    let value = 0;
    const stepValue = 0.01;
    const offset = 200;
    const decor1PositionY = decor1.position.y;

    decorTicker = () => {
        value += stepValue;
        decor1.position.y = decor1PositionY + offset * Math.cos(value);
    }

    app.ticker.add(decorTicker);

    decorContainer.addChild(decor1, decor2);
    app.stage.addChild(decorContainer);
}

export const clearDecor = () => {
    decorContainer.destroy({children: true});
    app.ticker.remove(decorTicker);
}