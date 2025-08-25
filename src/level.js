import * as PIXI from 'pixi.js';
import { app, gameState, startNewLevel } from './index.js';
import { heightField, sizeRect, widthField } from './field.js';
import { clearEnemy } from './enemy.js';

export let level;
let nextLevelContainer;

export const currentLevel = () => {
    const levelContainer = new PIXI.Container();
    level = new PIXI.Text({
        text: `Level: ${gameState.level}`,
        style: {
            fontFamily: 'Arial',
            fontSize: 34,
            fill: '#ffffff',
            fontWeight: 'bold',
            stroke: {
        color: '#4a1850',
        width: 5
    },
    dropShadow: {
        color: '#000000',
        blur: 4,
        distance: 6,
        angle: Math.PI / 6
    },
    wordWrap: true,
    wordWrapWidth: 440,
    lineHeight: 40,
    align: 'center'
        }
    })
    level.anchor.set(0.5)
    

    levelContainer.addChild(level);
    levelContainer.x = ((app.screen.width - widthField * sizeRect) / 2) + level.width / 2;
    levelContainer.y = (app.screen.height - heightField * sizeRect) / 4;
    app.stage.addChild(levelContainer);
}

export const nextLevelUp = async () => {
    const nextLevelSprite = await PIXI.Assets.load('assets/sprites/next_level.png');
    nextLevelContainer = new PIXI.Container();
    const nextLevel = new PIXI.Sprite({texture: nextLevelSprite});
    nextLevel.width = 200;
    nextLevel.height = 120;
    nextLevel.anchor.set(0.5);
    nextLevel.eventMode = 'static';
    nextLevel.cursor = 'pointer';
    nextLevel.on('pointerdown', () => {
        if (gameState.level < 3) {
            gameState.level += 1;
            level.text = `Level: ${gameState.level}`; 
            clearEnemy();
            startNewLevel();
        }
    })

    nextLevelContainer.addChild(nextLevel);
    nextLevelContainer.x = app.screen.width / 2;
    nextLevelContainer.y = (app.screen.height - heightField * sizeRect) / 4;
    app.stage.addChild(nextLevelContainer);
}

export const clearNextLevel = () => {
    nextLevelContainer.destroy({children: true});
}