import * as PIXI from 'pixi.js';
import { Input } from '@pixi/ui';
import { app, createRestartScene, gameState } from './index.js';
import { addScore, scores, scoresData } from './score.js';

let gameOverContainer;

export const gameOverActive = () => {

    gameOverContainer = new PIXI.Container();
    gameOverContainer.zIndex = 3;

    const title = new PIXI.Text({
        text: 'GAME OVER', 
        style: {
            fontFamily: 'Comic Sans MS',
            fontSize: 104,
            stroke: { color: '#ff0000ff', width: 6 },
            fill: '#ffffff'
        }
    });

    title.anchor.set(0.5);
    title.y = -100; 

    gameOverContainer.addChild(title);

    let t = 0;
    app.ticker.add(() => {
        t += 0.05;
        const scale = 1 + Math.sin(t) * 0.05;
        title.scale.set(scale);
        title.alpha = 0.7 + Math.sin(t * 2) * 0.3;
    });

    const gameOverBtn = new PIXI.Graphics()
        .roundRect(0, 0, 220, 70, 15)
        .fill({ color: 0x3498db });

    gameOverBtn.pivot.set(110, 35);
    gameOverBtn.y = 50;

    const btnText = new PIXI.Text({
        text: 'RESTART',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#ffffff',
            fontWeight: 'bold'
        }
    });
    btnText.anchor.set(0.5);
    btnText.y = 50;

    gameOverBtn.eventMode = 'static'; 
    gameOverBtn.cursor = 'pointer';
    gameOverBtn.on('pointerdown', () => {
        console.log('🔄 Restart game!');
        deleteGameOverActive();
        createRestartScene();
    });

    gameOverContainer.addChild(gameOverBtn, btnText);

    if(gameState.score >= Object.values(scoresData)[Object.values(scoresData).length - 1] || Object.values(scoresData).length < 10) {
        inputName();
    }

    gameOverContainer.x = app.screen.width / 2;
    gameOverContainer.y = app.screen.height / 2;

    app.stage.addChild(gameOverContainer);
};

const inputName = () => {

    const input = new Input({
        bg: new PIXI.Graphics()
        .roundRect(0, 0, 300, 70, 15)
        .fill({color: '#0fb7e0ff'}),
        placeholder: 'Enter your nickname',
        padding: [8, 0, 8, 0],
        textStyle: {
            fontFamily: 'Arial',
            fontSize: 22,
            fontWeight: 'bold',
            fill: '#ffffff',
        },
        maxLength: 3,
        align: 'center',
    })

    input.pivot.set(150, 35);
    input.y = 250;
    input.onEnter.connect((name) => {
        if (name !== '' && name in scores) {
            console.log('Имя занято')
            input.bg.clear();
            input.bg.roundRect(0, 0, 300, 70, 15).fill({ color: 0xfd0000 });
            input.placeholder.text = 'Nickname reserved';
        }
        else if (name !== '') {
            input.eventMode = 'none';
            input.alpha = 0.6;
            gameState.playerName = name;
            input.bg.clear();
            input.bg.roundRect(0, 0, 300, 70, 15).fill({ color: '#0fb7e0ff' });
            addScore();
        }
    })

    gameOverContainer.addChild(input);
}

const deleteGameOverActive = () => {
    gameOverContainer.destroy({cgildren: true});
}
