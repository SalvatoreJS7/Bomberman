import * as PIXI from 'pixi.js';
import { Input } from '@pixi/ui';
import { app, gameState, startNewLevel } from './index.js';
import { heightField, sizeRect, widthField } from './field.js';
import { scoresData, scores, addScore } from './score.js';

let winnerContainer;

export const winner = () => {
    winnerContainer = new PIXI.Container();
    const winnerText = new PIXI.Text({
        text: 'You win',
        style: {
            fontFamily: 'Comic Sans MS',
            fontSize: 104,
            stroke: { color: '#ff0000ff', width: 6 },
            fill: '#ffffff'
        }

    })

    winnerText.anchor.set(0.5);
    winnerText.y = - 200;

    let t = 0;
    app.ticker.add(() => {
        t += 0.05;
        const scale = 1 + Math.sin(t) * 0.05;
        winnerText.scale.set(scale);
        winnerText.alpha = 0.7 + Math.sin(t * 2) * 0.3;
    });

    winnerContainer.addChild(winnerText);

    const socialMedia = new PIXI.Text({
        text: 'Created by Vladimir Petrov \nTelegram: @vladimirsalvatore \nGithub: https://github.com/SalvatoreJS7 \nemail: vladimir7salvatore@gmail.com',
        style: {
            fontFamily: 'Arial',
            fontSize: 22,
            fill: '#ffffff',
            fontWeight: 'bold'
        }
    })

    socialMedia.anchor.set(0.5);
    socialMedia.y = 300;
    winnerContainer.addChild(socialMedia);

    winnerContainer.x = app.screen.width / 2;
    winnerContainer.y = app.screen.height / 2;
    app.stage.addChild(winnerContainer);

    if(gameState.score >= Object.values(scoresData)[Object.values(scoresData).length - 1] || Object.values(scoresData).length < 10) {
        inputNameWinner();
    }

}

const inputNameWinner = () => {

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
    input.y = -50;
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

    winnerContainer.addChild(input);
}