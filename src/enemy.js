import * as PIXI from 'pixi.js';
import { app, bombState, gameState } from './index.js';
import { sizeRect, widthField, heightField, fieldSize } from './field.js';
import { arrWall } from './wall.js';
import { arrStone } from './stone.js';
import { bombs } from './bomb.js';
import { bombermen, player, playerOff } from './bomberman.js';
import { getRandomInt } from './bonuses.js';

const enemySprite = await PIXI.Assets.load('/assets/sprites/enemy.png');
const speedsterSprite = await PIXI.Assets.load('/assets/sprites/speedster.png');
const ghostSprite = await PIXI.Assets.load('/assets/sprites/ghost.png');

export let enemies = [];
let enemyContainer;

export const createEnemy = (level) => {
    enemyContainer = new PIXI.Container();

    let enemyX = 0;
    let enemyY = 0;

    for(let i = 0; i < level.length; i++) {
        if(enemyX === widthField) {
            enemyY += 1;
            enemyX = 0;
        }

        if(level[i] === 'enemy') {
            const enemy = new PIXI.Sprite(enemySprite);
            enemy.width = sizeRect;
            enemy.height = sizeRect;
            enemy.index = i;
            enemy.x = enemyX * sizeRect;
            enemy.y = enemyY * sizeRect;
            enemies.push(enemy);
            enemyContainer.addChild(enemy);

            moveEnemy(enemy, 1)
        }

        if(level[i] === 'speedster') {
            const speedster = new PIXI.Sprite(speedsterSprite);
            speedster.width = sizeRect;
            speedster.height = sizeRect;
            speedster.index = i;
            speedster.x = enemyX * sizeRect;
            speedster.y = enemyY * sizeRect;
            enemies.push(speedster);
            enemyContainer.addChild(speedster)

            moveEnemy(speedster, 2);
        }

        if(level[i] === 'ghost') {
            const ghost = new PIXI.Sprite(ghostSprite);
            ghost.width = sizeRect;
            ghost.height = sizeRect;
            ghost.index = i;
            ghost.x = enemyX * sizeRect;
            ghost.y = enemyY * sizeRect;
            enemies.push(ghost);
            enemyContainer.addChild(ghost);

            moveGhost(ghost, 1);
        }

        enemyX += 1;
    }

    enemyContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    enemyContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    enemyContainer.zIndex = 2;

    app.stage.addChild(enemyContainer);
}

export const createSpeedstersFromTeleport = (index) => {
    for (let i = 0 ; i < 3; i++) {
        console.log("Создаём врагов из телепорта", index);
        const speedster = new PIXI.Sprite(speedsterSprite);
        speedster.width = sizeRect;
        speedster.height = sizeRect;
        speedster.index = index;
        speedster.x = index % widthField * sizeRect;
        speedster.y = Math.trunc(index / widthField) * sizeRect;
        enemies.push(speedster);
        enemyContainer.addChild(speedster)

        moveEnemy(speedster, 2);
    }
}

const moveEnemy = (enemy, speed) => {
    let moveUp = true;
    let moveDown = false;
    let moveLeft = false;
    let moveRight = false;

    let moveState = [() => moveUp = true, () => moveDown = true,() => moveLeft = true, () => moveRight = true];

    let moveValue = 0;
    // let speed = 1;

    const enemyTick = () => {
        if(!moveDown && !moveLeft && !moveRight && !moveUp) {
            moveUp = moveDown = moveLeft = moveRight = false;
            moveState[getRandomInt(moveState.length - 1)]();
        }

    if(moveUp) {
            if(arrWall[enemy.index - widthField] || arrStone[enemy.index - widthField] || bombs[enemy.index - widthField] || enemy.index - widthField < 0) {
                moveUp = false;
                moveDown = true;
                return;
            }
            

            enemy.y -= speed;
            moveValue += speed;
            
            if(moveValue >= sizeRect) {
                enemy.index -= widthField;
                moveValue = 0;

                if(!arrWall[enemy.index - 1] && !arrStone[enemy.index - 1] && !bombs[enemy.index - 1] && enemy.index % widthField !== 0) {
                    if (Math.round(Math.random()) === 0) {
                        moveUp = false;
                        moveLeft = true;
                        return;
                    }
                }
            }
            
        }

        if(moveDown) {
            if(arrWall[enemy.index + widthField] || arrStone[enemy.index + widthField] || bombs[enemy.index + widthField] || enemy.index + widthField >= fieldSize) {
                moveDown = false;
                moveUp = true;
                return;
            }

            enemy.y += speed;
            moveValue += speed;

            if(moveValue >= sizeRect) {
                enemy.index += widthField;
                moveValue = 0;

                if(!arrWall[enemy.index + 1] && !arrStone[enemy.index + 1] && !bombs[enemy.index + 1] && enemy.index % widthField !== widthField - 1) {
                    if (Math.round(Math.random()) === 0) {
                        moveDown = false;
                        moveRight = true;
                        return;
                    }
                }
            }

        }
        
        if(moveLeft) {
            if(arrWall[enemy.index - 1] || arrStone[enemy.index - 1] || bombs[enemy.index - 1] || enemy.index % widthField === 0) {
                moveLeft = false;
                moveRight = true;
                return;
            }

            enemy.x -= speed;
            moveValue += speed;

            if(moveValue >= sizeRect) {
                enemy.index -= 1;
                moveValue = 0;

                

                if(!arrWall[enemy.index + widthField] && !arrStone[enemy.index + widthField] && !bombs[enemy.index + widthField] && enemy.index + widthField < fieldSize) {
                    if (Math.round(Math.random()) === 0) {
                        moveLeft = false;
                        moveDown = true;
                        return;
                    }
                }
            }
        }

        if(moveRight) {
            if(arrWall[enemy.index + 1] || arrStone[enemy.index + 1] || bombs[enemy.index + 1] || enemy.index % widthField === widthField - 1) {
                moveRight = false;
                moveLeft = true;
                return;
            }

            enemy.x += speed;
            moveValue += speed;

            if(moveValue >= sizeRect) {
                enemy.index += 1;
                moveValue = 0;

                if(!arrWall[enemy.index - widthField] && !arrStone[enemy.index - widthField] && !bombs[enemy.index - widthField] && enemy.index - widthField >= 0) {
                    if (Math.round(Math.random()) === 0) {
                        moveRight = false;
                        moveUp = true;
                        return;
                    }
                }

                
            }
        }
        // console.log(enemy.index)
        // console.log(rightBorder, enemy.x)
        enemyDestroyPlayer(enemy);
}

    enemy.tick = enemyTick;
    app.ticker.add(enemyTick)
    
}

const moveGhost = (enemy, speed) => {
    let moveUp = true;
    let moveDown = false;
    let moveLeft = false;
    let moveRight = false;

    let moveValue = 0;

    const enemyTick = () => {
    if(moveUp) {
            if(arrStone[enemy.index - widthField] || enemy.index - widthField < 0) {
                moveUp = false;
                moveDown = true;
                return;
            }
            

            enemy.y -= speed;
            moveValue += speed;
            
            if(moveValue >= sizeRect) {
                enemy.index -= widthField;
                moveValue = 0;

                if(!arrStone[enemy.index - 1] && enemy.index % widthField !== 0) {
                    if (Math.round(Math.random()) === 0) {
                        moveUp = false;
                        moveLeft = true;
                        return;
                    }
                }
            }
            
        }

        if(moveDown) {
            if(arrStone[enemy.index + widthField] || enemy.index + widthField >= fieldSize) {
                moveDown = false;
                moveUp = true;
                return;
            }

            enemy.y += speed;
            moveValue += speed;

            if(moveValue >= sizeRect) {
                enemy.index += widthField;
                moveValue = 0;

                if(!arrStone[enemy.index + 1] && enemy.index % widthField !== widthField - 1) {
                    if (Math.round(Math.random()) === 0) {
                        moveDown = false;
                        moveRight = true;
                        return;
                    }
                }
            }

        }
        
        if(moveLeft) {
            if(arrStone[enemy.index - 1] || enemy.index % widthField === 0) {
                moveLeft = false;
                moveRight = true;
                return;
            }

            enemy.x -= speed;
            moveValue += speed;

            if(moveValue >= sizeRect) {
                enemy.index -= 1;
                moveValue = 0;

                

                if(!arrStone[enemy.index + widthField] && enemy.index + widthField < fieldSize) {
                    if (Math.round(Math.random()) === 0) {
                        moveLeft = false;
                        moveDown = true;
                        return;
                    }
                }
            }
        }

        if(moveRight) {
            if(arrStone[enemy.index + 1] || enemy.index % widthField === widthField - 1) {
                moveRight = false;
                moveLeft = true;
                return;
            }

            enemy.x += speed;
            moveValue += speed;

            if(moveValue >= sizeRect) {
                enemy.index += 1;
                moveValue = 0;

                if(!arrStone[enemy.index - widthField] && enemy.index - widthField >= 0) {
                    if (Math.round(Math.random()) === 0) {
                        moveRight = false;
                        moveUp = true;
                        return;
                    }
                }

                
            }
        }
        // console.log(enemy.index)
        // console.log(rightBorder, enemy.x)
        enemyDestroyPlayer(enemy);
}

    enemy.tick = enemyTick;
    app.ticker.add(enemyTick)
    
}

export const handleEnemyDestroy = (bomb) => {

    const toRemove = [];

    // for (let i = 0; i < enemies.length; i++) {
    //     for(let j = 1; j <= bombState.bombRadius; j++) {
    //         if (bomb.bombIndex % widthField !== widthField - 1 && enemies[i].index === bomb.bombIndex + j) {
    //             toRemove.push(enemies[i]);
    //         }
    //         if(bomb.bombIndex % widthField !== 0 && enemies[i].index === bomb.bombIndex - j) {
    //             toRemove.push(enemies[i]);
    //         }
    //         if(enemies[i].index === bomb.bombIndex + widthField * j) {
    //             toRemove.push(enemies[i]);
    //         }
    //         if(enemies[i].index === bomb.bombIndex - widthField * j) {
    //             toRemove.push(enemies[i]);
    //         }
    //     } 

    //     if(enemies[i].index === bomb.bombIndex){
    //             toRemove.push(enemies[i]);
    //         }
    // }

    for (let i = 0; i < enemies.length; i++) {
        for(let j = 1; j <= bombState.bombRadius; j++) {
            if (Math.floor((bomb.bombIndex + j) / widthField) !== Math.floor(bomb.bombIndex / widthField) || arrWall[bomb.bombIndex + j] || arrStone[bomb.bombIndex + j]) break; 

            if (enemies[i].index === bomb.bombIndex + j) {
                toRemove.push(enemies[i]);
            }
        }
        for(let j = 1; j <= bombState.bombRadius; j++) {
            if (Math.floor((bomb.bombIndex - j) / widthField) !== Math.floor(bomb.bombIndex / widthField) || arrWall[bomb.bombIndex - j] || arrStone[bomb.bombIndex - j]) break; 

            if(enemies[i].index === bomb.bombIndex - j) {
                toRemove.push(enemies[i]);
            }
        }
        for(let j = 1; j <= bombState.bombRadius; j++) {
            if (arrWall[bomb.bombIndex + widthField * j] || arrStone[bomb.bombIndex + widthField * j]) break;

            if(enemies[i].index === bomb.bombIndex + widthField * j) {
                toRemove.push(enemies[i]);
            }
        }
        for(let j = 1; j <= bombState.bombRadius; j++) {  
            if (arrWall[bomb.bombIndex - widthField * j] || arrStone[bomb.bombIndex - widthField * j]) break;
            
            if(enemies[i].index === bomb.bombIndex - widthField * j) {
                toRemove.push(enemies[i]);
            }
        }

        if(enemies[i].index === bomb.bombIndex){
                toRemove.push(enemies[i]);
            }
    }

    for(let i = 0; i < toRemove.length; i++) {
        destroyEnemy(toRemove[i])
    }

    if(enemies.length === 0) {
        console.log('winner');
        gameState.teleportActive = true;
        console.log(gameState.teleportActive);
    }
}

console.log(enemies)

const destroyEnemy = (enemy) => {
    console.log('enemy hit');
    app.ticker.remove(enemy.tick);
    enemy.destroy({ children: true });
    enemies.splice(enemies.indexOf(enemy), 1);
    console.log(enemies);
}

const enemyDestroyPlayer = (enemy) => {
    //todo implement lives
    if(player && bombermen.currentIndex === enemy.index) {
        console.log('hit');
        playerOff();
    }
}

export const checkedEnemy = () => {
    for(let i = 0; i < enemies.length; i++) {
        if(bombermen.currentIndex % widthField !== widthField - 1 && bombermen.currentIndex + 1 === enemies[i].index) {
            return false;
        }
        if(bombermen.currentIndex % widthField !== 0 && bombermen.currentIndex - 1 === enemies[i].index) {
            return false;
        }
        if(bombermen.currentIndex + widthField === enemies[i].index){
            return false;
        }
        if(bombermen.currentIndex - widthField === enemies[i].index) {
            return false;
        }
    }

    return true;
}

