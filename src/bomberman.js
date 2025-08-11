import * as PIXI from 'pixi.js';
import { app, bombState } from './index.js';
import { sizeRect, widthField, heightField, leftBorder, topBorder, rightBorder, bottomBorder } from './field.js';
import { arrWall } from './wall.js';
import { arrStone } from './stone.js';
import { getBonus } from './bonuses.js';

export let bombermen;
let livesAmount = 5;
let livesText;
export let player = true;

const spriteBombermen = await PIXI.Assets.load('/assets/sprites/bomberman2.png');
const livesSprite = await PIXI.Assets.load('assets/sprites/lives.png');

export const createBombermen = () => {

    const bombermenContainer = new PIXI.Container();

    bombermen = new PIXI.Sprite(spriteBombermen);
    bombermen.width = sizeRect;
    bombermen.height = sizeRect;
    bombermen.interactive = true;
    bombermen.x = (app.screen.width - widthField * sizeRect) / 2;
    bombermen.y = (app.screen.height - heightField * sizeRect) / 2;
    bombermenContainer.zIndex = 2;
    // custom atributes
    bombermen.currentIndex = 0;
    

    bombermenContainer.addChild(bombermen);
    app.stage.addChild(bombermenContainer);

}

export const moveBombermen = () => {
    
    let moveValue = 0;
    let stepValue = 5;
    let isMoving = false;
    let move = '';
   
    document.addEventListener('keydown', (e) => {
        if(e.key === 'ArrowRight' && bombermen.position.x < rightBorder && !arrWall[bombermen.currentIndex + 1] && !arrStone[bombermen.currentIndex + 1] && !isMoving) { 
            isMoving = true;
            move = 'right';
        } 
        if(e.key === 'ArrowLeft' && bombermen.position.x > leftBorder && !arrWall[bombermen.currentIndex - 1] && !arrStone[bombermen.currentIndex - 1] && !isMoving) {
            isMoving = true;
            move = 'left';
        }
        if(e.key === 'ArrowUp' && bombermen.position.y > topBorder && !arrWall[bombermen.currentIndex - widthField] && !arrStone[bombermen.currentIndex - widthField] && !isMoving) {
            isMoving = true;
            move = 'up';
        }
        if(e.key === 'ArrowDown' && bombermen.position.y < bottomBorder && !arrWall[bombermen.currentIndex + widthField] && !arrStone[bombermen.currentIndex + widthField] && !isMoving) {
            isMoving = true;
            move = 'down';       
        }
    })

    app.ticker.add(() => {
        if(!isMoving) return;
        
        if(move === 'right') {
            bombermen.x += stepValue;
            moveValue += stepValue; 
            if(moveValue >= sizeRect) {
                isMoving = false;
                move = '';
                moveValue = 0;
                bombermen.currentIndex += 1;
            }
        }

        if(move === 'left') {
            bombermen.x -= stepValue;
            moveValue += stepValue; 
            if(moveValue >= sizeRect) {
                isMoving = false;
                move = '';
                moveValue = 0;
                bombermen.currentIndex -= 1;
            }
        }

        if(move === 'up') {
            bombermen.y -= stepValue;
            moveValue += stepValue; 
            if(moveValue >= sizeRect) {
                isMoving = false;
                move = '';
                moveValue = 0;
                bombermen.currentIndex -= widthField;
            }
        }

        if(move === 'down') {
            bombermen.y += stepValue;
            moveValue += stepValue; 
            if(moveValue >= sizeRect) {
                isMoving = false;
                move = '';
                moveValue = 0;
                bombermen.currentIndex += widthField;
            }
        }
        getBonus(bombermen);
    })
}

export const handlePlayerDestroy = (bomb) => {
    for(let i = 1; i <= bombState.bombRadius; i++) {
        if (bomb.bombIndex % widthField !== widthField - 1 && bombermen.currentIndex === bomb.bombIndex + i && player) {
            playerOff();
        }
        if(bomb.bombIndex % widthField !== 0 && bombermen.currentIndex === bomb.bombIndex - i && player) {
            playerOff();
        }
        if(bombermen.currentIndex === bomb.bombIndex + widthField * i && player) {
            playerOff();
        }
        if(bombermen.currentIndex === bomb.bombIndex - widthField * i && player) {
            playerOff();
        }
        
    }
    
    if(bombermen.currentIndex === bomb.bombIndex && player){
        playerOff();
    }
}

export const playerOff = () => {
    
    player = false;
    bombermen.alpha = 0.5;
    let blink;
    livesAmount -= 1;
    livesText.text = `= ${livesAmount}`;
    
    setTimeout(() => {
        blink = setInterval(() => {
            bombermen.alpha = bombermen.alpha === 1 ? 0.5 : 1
        },200)
    },2000)
    
    setTimeout(() => {
        player = true;
        bombermen.alpha = 1;
        app.ticker.remove();
        clearInterval(blink);
    },4000)

    
}

export const playerLives = () => {
    const livesContainer = new PIXI.Container();
    const lives = new PIXI.Sprite(livesSprite);
    lives.width = 100;
    lives.height = 100;
    lives.position.set(-lives.width - 65, 0)
    livesContainer.addChild(lives);

    livesText = new PIXI.Text({
        text: `= ${livesAmount}`,
        style: {
            fontFamily: 'Arial',
            fontSize: 100,
            fill: '#ffffff',
        }
    });

    livesText.position.set(-40, 0)
    livesContainer.addChild(livesText)
    

    livesContainer.x = app.screen.width - 150;
    livesContainer.y = 50;

    app.stage.addChild(livesContainer);

}