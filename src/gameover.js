import * as PIXI from 'pixi.js';
import { app, bombState, createRestartScene, gameState } from './index.js';
import { sizeRect, widthField, heightField, fieldSize } from './field.js';
import { livesText } from './bomberman.js';

let gameOverContainer;

export const gameOverActive = () => {

    gameOverContainer = new PIXI.Container();
    gameOverContainer.zIndex = 3;

    // === Текст "GAME OVER"
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
    title.y = -100; // чуть выше центра

    gameOverContainer.addChild(title);

    // === Анимация пульсации текста
    let t = 0;
    app.ticker.add(() => {
        t += 0.05;
        const scale = 1 + Math.sin(t) * 0.05;
        title.scale.set(scale);
        title.alpha = 0.7 + Math.sin(t * 2) * 0.3;
    });

    // === Кнопка "Restart"
    const gameOverBtn = new PIXI.Graphics()
        .roundRect(0, 0, 220, 70, 15)
        .fill({ color: 0x3498db });

    gameOverBtn.pivot.set(110, 35); // центр кнопки
    gameOverBtn.y = 50;

    // Текст внутри кнопки
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

    // Делаем кнопку интерактивной
    gameOverBtn.eventMode = 'static'; // в Pixi v8 вместо interactive = true
    gameOverBtn.cursor = 'pointer';
    gameOverBtn.on('pointerdown', () => {
        console.log('🔄 Restart game!');
        deleteGameOverActive();
        createRestartScene();
    });

    gameOverContainer.addChild(gameOverBtn, btnText);

    // === Центрируем контейнер
    gameOverContainer.x = app.screen.width / 2;
    gameOverContainer.y = app.screen.height / 2;

    app.stage.addChild(gameOverContainer);
};

const deleteGameOverActive = () => {
    gameOverContainer.destroy({cgildren: true});
}
