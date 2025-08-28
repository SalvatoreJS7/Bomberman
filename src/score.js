import * as PIXI from 'pixi.js';
import { app, bombState, gameState } from './index.js';
import { sizeRect, widthField, heightField, fieldSize } from './field.js';

const sortObject = (object) => {
    const sortArray = Object.entries(object).sort((a, b) =>  b[1] - a[1]);
    if(sortArray.length > 10) {
        sortArray.length = 10;
    }
    const ArrayToObject = Object.fromEntries(sortArray);
    return ArrayToObject;
} 

export let scoreText;
let scoreContainer;
let leaderBoardContainer;
export let scores = JSON.parse(localStorage.getItem("scores")) || {};
export let scoresData = sortObject(scores);

export const scoreRender = () => {
    scoreContainer = new PIXI.Container();
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
  scores = JSON.parse(localStorage.getItem("scores")) || {};

  // добавляем новое число
  scores[gameState.playerName] = gameState.score;
  scoresData = sortObject(scores);

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
    
    let index = 0;

    for (let key in scoresData) {
        
        index += 1;
        let positionY = 30;
        const leaderBoardText = new PIXI.Text({
            text: `${index}. ${key}: ${scoresData[key]}`,
            style: {
                fontFamily: 'Arial',
                fontSize: 22,
                fill: '#ffffff',
                fontWeight: 'bold'
            }
        })
        leaderBoardText.x = 30;
        leaderBoardText.y = positionY * index + 50;
        leaderBoardContainer.addChild(leaderBoardText); 
    }

   

    leaderBoardContainer.x = app.screen.width - 300;
    leaderBoardContainer.y = 300;
    app.stage.addChild(leaderBoardContainer);
}

export const destroyLeaderBoard = () => {
    leaderBoardContainer.destroy({children: true});
}

export const clearScore = () => {
    scoreContainer.destroy({children: true});
}
