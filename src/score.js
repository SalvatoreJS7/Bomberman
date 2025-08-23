import * as PIXI from 'pixi.js';
import { app, bombState, gameState } from './index.js';
import { sizeRect, widthField, heightField, fieldSize } from './field.js';

export let scoreText;
let leaderBoardContainer;
let scores = JSON.parse(localStorage.getItem("scores")) || [];
scores.sort((a, b) => b - a);
scores.length = 10;

export const scoreRender = () => {
    const scoreContainer = new PIXI.Container();
    scoreText = new PIXI.Text({
        text: `Score: ${gameState.score}`,
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#ffffff',
            fontWeight: 'bold'
        }
    })

    scoreContainer.addChild(scoreText);
    scoreContainer.zIndex = 3;
    scoreContainer.x = app.screen.width - 300;
    scoreContainer.y = 200;

    app.stage.addChild(scoreContainer);
}

export function addScore() {
  // достаём массив из localStorage, если нет — создаём пустой
  scores = JSON.parse(localStorage.getItem("scores")) || [];

  // добавляем новое число
  scores.push(gameState.score);
  scores.sort((a, b) => b - a);
  scores.length = 10;

  // сохраняем обратно
  localStorage.setItem("scores", JSON.stringify(scores));
}

export const leaderBoard = () => {
    leaderBoardContainer = new PIXI.Container;
    const leaderBoardTitle = new PIXI.Text({
        text: 'TOP 10 scores',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#ffffff',
            fontWeight: 'bold',
        }
    });
    leaderBoardTitle.y = 0; 
    
    leaderBoardContainer.addChild(leaderBoardTitle);
    
    scores.forEach((score, index) => {
        let positionY = 30;
        const leaderBoardText = new PIXI.Text({
            text: `${index + 1}. ${score}`,
            style: {
                fontFamily: 'Arial',
                fontSize: 22,
                fill: '#ffffff',
                fontWeight: 'bold'
            }
        })
        leaderBoardText.x = 50;
        leaderBoardText.y = positionY * index + 50;
        leaderBoardContainer.addChild(leaderBoardText); 
    });

   

    leaderBoardContainer.x = app.screen.width - 300;
    leaderBoardContainer.y = 300;
    app.stage.addChild(leaderBoardContainer);
}

export const destroyLeaderBoard = () => {
    leaderBoardContainer.destroy({children: true});
}
