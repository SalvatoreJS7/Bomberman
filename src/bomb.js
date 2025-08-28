import * as PIXI from 'pixi.js';
import { app, bombState, gameState} from './index.js';
import { fieldSize, sizeRect, widthField } from './field.js';
import { bombermen, handlePlayerDestroy } from './bomberman.js';
import { arrStone } from './stone.js';
import { arrWall, handleWallDestroy } from './wall.js';
import { checkedEnemy, enemies, handleEnemyDestroy } from './enemy.js';
import { handleBonusDestroy, heandleTeleportExplosion } from './bonuses.js';



export let bombs = [];
export let explosions = [];
export let explosionContainer;


export const createBomb = () => {
     
    let isBomb = false;

    document.addEventListener('keydown', async (e) => {
        if (bombermen.destroyed) return;
        const bombSprite = await PIXI.Assets.load('assets/sprites/bomb.png');
        if(e.key === ' ' && isBomb === false && checkedEnemy()) {
            const bombContainer = new PIXI.Container();
            const bomb = new PIXI.Sprite(bombSprite); // make bomb local variable
            bomb.width = sizeRect * 0.6;
            bomb.height = sizeRect * 0.6;
            bombContainer.zIndex = 1.5;
            bomb.position.x = bombermen.position.x + ((sizeRect - bomb.width) / 2);
            bomb.position.y = bombermen.position.y + ((sizeRect - bomb.height))
            bombState.bombAmount -= 1
            if(bombState.bombAmount === 0) {
                isBomb = true;
            }
            
            //custom atributes
            bomb.bombIndex = bombermen.currentIndex;
            bombs[bomb.bombIndex] = bomb;

            bombContainer.addChild(bomb);
            app.stage.addChild(bombContainer);

            setTimeout(async () => {
                await createExplosionX(bomb);
                await createExplosionY(bomb);
                handleBombExplosion(bomb);
                console.log(enemies);
                bomb.destroy({children: true});
                bombs[bomb.bombIndex] = undefined;
                isBomb = false;
                bombState.bombAmount += 1;
            }, 2000)
        }
    })
    
}

const handleBombExplosion = (bomb) => {
    heandleTeleportExplosion(bomb);
    handleBonusDestroy(bomb);
    handlePlayerDestroy(bomb);
    handleEnemyDestroy(bomb);
    handleWallDestroy(bomb);
    
}   

const createExplosionX = async (bomb) => {
    explosionContainer = new PIXI.Container();
    const explosionSprite = await PIXI.Assets.load('assets/sprites/explosion2.png');

    const explosion = new PIXI.Sprite(explosionSprite);
    let widthX = 1;
    let biasX = 0;
    for(let i = 1; i <= bombState.bombRadius; i++) {
        if(arrStone[bomb.bombIndex + i] || Math.floor((bomb.bombIndex + i) / widthField) !== Math.floor(bomb.bombIndex / widthField)){
            break;
        }
        if(arrWall[bomb.bombIndex + i]) {
            widthX += 1;
            break;
        }
        widthX += 1;
    }

    for(let i = 1; i <= bombState.bombRadius; i++) {
        if(arrStone[bomb.bombIndex - i] || Math.floor((bomb.bombIndex - i) / widthField) !== Math.floor(bomb.bombIndex / widthField)){
            break;
        }
        if(arrWall[bomb.bombIndex - i]) {
            widthX += 1;
            biasX += 1;
            break;
        }
        widthX += 1;
        biasX += 1;
    }

    explosion.width = sizeRect * widthX;
    explosion.height = sizeRect;
    explosionContainer.zIndex = 2;
    explosion.position.x = bomb.position.x - (sizeRect - bomb.width) / 2 - (sizeRect * biasX);
    explosion.position.y = bomb.position.y - ((sizeRect - bomb.height));
    explosions.push(explosion);
    
    setTimeout(() => {
        explosion.destroy({children: true})
        explosions.length = 0;
    }, 500)

    explosionContainer.addChild(explosion);
    app.stage.addChild(explosionContainer);
}

const createExplosionY = async (bomb) => {
    const explosionSprite = await PIXI.Assets.load('assets/sprites/explosion2.png');
    // const explosionContainer = new PIXI.Container();
    const explosion = new PIXI.Sprite(explosionSprite);
    let widthY = 1;
    let biasY = 0;
    for(let i = 1; i <= bombState.bombRadius; i++) {
        if(arrStone[bomb.bombIndex - widthField * i] || bomb.bombIndex - widthField * i < 0){
            break;
        }
        if(arrWall[bomb.bombIndex - widthField * i]) {
            widthY += 1;
            biasY += 1;
            break;
        }
        widthY += 1;
        biasY += 1;
    }

    for(let i = 1; i <= bombState.bombRadius; i++) {
        if(arrStone[bomb.bombIndex + widthField * i] || bomb.bombIndex + widthField * i >= fieldSize){
            break;
        }
        if(arrWall[bomb.bombIndex + widthField * i]) {
            widthY += 1;
            break;
        }
        widthY += 1;
    }

    if(widthY === 1) {
        return;
    }

    explosion.width = sizeRect;
    explosion.height = sizeRect * widthY;
    explosionContainer.zIndex = 2;
    explosion.position.x = bomb.position.x - (sizeRect - bomb.width) / 2;
    explosion.position.y = bomb.position.y - ((sizeRect - bomb.height)) - (sizeRect * biasY);
    explosions.push(explosion);
    
    setTimeout(() => {
        explosion.destroy({children: true})
        explosion.length = 0;
    }, 500)

    explosionContainer.addChild(explosion);
    app.stage.addChild(explosionContainer);
}

