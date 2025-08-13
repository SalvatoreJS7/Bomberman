import * as PIXI from 'pixi.js';
import { app, bombState} from './index.js';
import { sizeRect } from './field.js';
import { bombermen, handlePlayerDestroy } from './bomberman.js';
import { arrStone } from './stone.js';
import { handleWallDestroy } from './wall.js';
import { handleEnemyDestroy } from './enemy.js';
import { heandleTeleportExplosion } from './bonuses.js';

const bombSprite = await PIXI.Assets.load('/assets/sprites/bomb.png');
const explosionSprite = await PIXI.Assets.load('/assets/sprites/explosion2.png');

export let bombs = [];


export const createBomb = () => {
     
    let isBomb = false;

    document.addEventListener('keydown', (e) => {
        if(e.key === ' ' && isBomb === false) {
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

            setTimeout(() => {
                createExplosionX(bomb);
                createExplosionY(bomb);
                handleBombExplosion(bomb);
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
    handlePlayerDestroy(bomb);
    handleEnemyDestroy(bomb);
    handleWallDestroy(bomb);
     // 4.destroy bonus
}   

const createExplosionX = (bomb) => {
    const explosionContainer = new PIXI.Container();
    const explosion = new PIXI.Sprite(explosionSprite);
    explosion.width = sizeRect * bombState.explosionSize;
    explosion.height = sizeRect;
    explosionContainer.zIndex = 2;
    explosion.position.x = bomb.position.x - ((sizeRect - bomb.width) / 2) - sizeRect * bombState.bombRadius;
    explosion.position.y = bomb.position.y - ((sizeRect - bomb.height));
    
    setTimeout(() => {
        explosion.destroy({children: true})
    }, 500)

    explosionContainer.addChild(explosion);
    app.stage.addChild(explosionContainer);
}

const createExplosionY = (bomb) => {
    const explosionContainer = new PIXI.Container();
    const explosion = new PIXI.Sprite(explosionSprite);
    explosion.width = sizeRect;
    explosion.height = sizeRect * bombState.explosionSize;
    explosionContainer.zIndex = 2;
    explosion.position.x = bomb.position.x - ((sizeRect - bomb.width) / 2);
    explosion.position.y = bomb.position.y - ((sizeRect - bomb.height)) - sizeRect * bombState.bombRadius;
    
    setTimeout(() => {
        explosion.destroy({children: true})
    }, 500)

    explosionContainer.addChild(explosion);
    app.stage.addChild(explosionContainer);
}

