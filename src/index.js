import * as PIXI from 'pixi.js';

const app = new PIXI.Application();
await app.init({
    background: '#000000ff',
    antialias: true,
    width: window.innerWidth,
    height: window.innerHeight,
})

document.body.appendChild(app.canvas);

app.stage.sortableChildren = true;
const textureGrass = await PIXI.Assets.load('/assets/textures/grass.avif');
const textureWall = await PIXI.Assets.load('/assets/textures/stone2.png');
const spriteBombermen = await PIXI.Assets.load('/assets/sprites/bomberman2.png');
const bombSprite = await PIXI.Assets.load('/assets/sprites/bomb.png');
const explosionSprite = await PIXI.Assets.load('/assets/sprites/explosion2.png');
const decorSprite1 = await PIXI.Assets.load('/assets/sprites/joystick.png');
const decorSprite2 = await PIXI.Assets.load('/assets/sprites/supernintendo.png');
const textureStone = await PIXI.Assets.load('/assets/sprites/stone3.jpg');
const destroyWall = await PIXI.Assets.load('/assets/sprites/destroyWall.png');
const enemySprite = await PIXI.Assets.load('/assets/sprites/enemy.png');
const livesSprite = await PIXI.Assets.load('assets/sprites/lives.png');
const bonusExplosionSprite = await PIXI.Assets.load('/assets/sprites/bonusExplosion.png');
const bonusBombSprite = await PIXI.Assets.load('/assets/sprites/bonusBomb.png');

const level1 = [
  '', '', 'wall', 'wall', '', '', 'wall', '', '', 'wall', 'wall', '', 'enemy',
  '', 'stone', '', 'stone', '', 'stone', '', 'stone', 'wall', 'stone', '', 'stone', '',
  '', '', '', '', '', '', 'wall', '', '', '', 'wall', '', 'wall',
  'wall', 'stone', 'wall', 'stone', 'wall', 'stone', 'wall', 'stone', '', 'stone', 'wall', 'stone', 'wall',
  'wall', '', 'wall', '', '', '', '', '', '', '', 'wall', '', '',
  '', 'stone', '', 'stone', '', 'stone', '', 'stone', '', 'stone', '', 'stone', '',
  '', '', '', '', 'wall', '', '', '', 'wall', '', '', '', '',
  '', 'stone', '', 'stone', '', 'stone', 'wall', 'stone', '', 'stone', 'wall', 'stone', '',
  '', 'wall', 'wall', '', 'enemy', '', 'wall', 'wall', '', '', 'wall', '', 'enemy'
];

const bonusForLevel1 = ['explosion+', 'bomb+'];

const sizeRect = 80; 
let widthField = 13;
let heightField = 9;
let livesAmount = 5;
const fieldSize = widthField * heightField;
let fieldX = 0;
let fieldY = 0;
let fieldContainer;
let bombermen;
let bombRadius = 1;
let bombAmount = 1;
// let enemy;
let arrWall = [];
let arrStone = [];
let enemies = [];
let bonusesExplosion = [];
let bonusesBomb = [];
let explosionSize = 3;
let livesText;
let player = true;
// let explosionActive = true;

let leftBorder;
let rightBorder;
let topBorder;
let bottomBorder;

    

const createField = () => {

    fieldContainer = new PIXI.Container();

    for(let i = 0; i < fieldSize; i++) {

        if(fieldX === widthField) {
            fieldY += 1;
            fieldX = 0;
        }

        const field = new PIXI.Graphics();
        field.rect(0, 0, sizeRect, sizeRect).fill({texture: textureGrass});
        
        field.x = fieldX * sizeRect;
        field.y = fieldY * sizeRect;
        
        fieldX += 1;
        
        fieldContainer.addChild(field);

    }

    fieldContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    fieldContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    fieldContainer.zIndex = 1;

    app.stage.addChild(fieldContainer);

    leftBorder = fieldContainer.x;
    topBorder = fieldContainer.y;
    rightBorder = leftBorder + (widthField * sizeRect) - sizeRect;
    bottomBorder = topBorder + (heightField * sizeRect) - sizeRect;

}

const createBombermen = () => {

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

const moveBombermen = () => {
    
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
        getBonus();
    })
}

const getBonus = () => {
    getBonusExplosion();
    getBonusBomb();
}

const getBonusExplosion = () => {
    
    
    if(bonusesExplosion[bombermen.currentIndex]) {
        console.log('getiing bonus')
        bonusesExplosion[bombermen.currentIndex].destroy({children: true})
        bonusesExplosion[bombermen.currentIndex] = undefined;
        explosionSize += 2;
        bombRadius += 1;
    }
};

const getBonusBomb = () => {
    if(bonusesBomb[bombermen.currentIndex]) {
        bonusesBomb[bombermen.currentIndex].destroy({children: true});
        bonusesBomb[bombermen.currentIndex] = undefined;
        bombAmount += 1;
    }
}

const createWall = (level) => {

    let wallX = 0;
    let wallY = 0;

    const wallContainer = new PIXI.Container();
    for (let i = 0; i < fieldSize; i++) {

        if(wallX === widthField) {
            wallY += 1;
            wallX = 0;
        }

        if (level[i] === 'wall') {

        const wall = new PIXI.Graphics();
        wall.rect(0, 0, sizeRect, sizeRect).fill({ texture: textureWall });

        wall.x = wallX * sizeRect;
        wall.y = wallY * sizeRect;

        arrWall[i] = wall;
        wallContainer.addChild(wall);
        }

        wallX += 1;
    }
    console.log(arrWall)


    wallContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    wallContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    wallContainer.zIndex = 2;

    app.stage.addChild(wallContainer);
}

const createStone = (level) => {

    let stoneX = 0;
    let stoneY = 0;

    const stoneContainer = new PIXI.Container();
     for(let i = 0; i < fieldSize; i++) {

        if(stoneX === widthField) {
            stoneY += 1;
            stoneX = 0;
        }

        if(level[i] === 'stone') {
            const stone = new PIXI.Graphics();
            stone.rect(0, 0, sizeRect, sizeRect).fill({texture: textureStone});

            stone.x = stoneX * sizeRect;
            stone.y = stoneY * sizeRect;

            
            arrStone[i] = stone;
            stoneContainer.addChild(stone);
        }

        stoneX += 1;
    }
    stoneContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    stoneContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    stoneContainer.zIndex = 2;
    app.stage.addChild(stoneContainer);

} 

const createBomb = () => {
     
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
            bombAmount -= 1
            if(bombAmount === 0) {
                isBomb = true;
            }
            
            //custom atributes
            bomb.bombIndex = bombermen.currentIndex;
            arrStone[bomb.bombIndex] = bomb;

            bombContainer.addChild(bomb);
            app.stage.addChild(bombContainer);

            setTimeout(() => {
                createExplosionX(bomb);
                createExplosionY(bomb);
                handleBombExplosion(bomb);
                bomb.destroy({children: true});
                arrStone[bomb.bombIndex] = undefined;
                isBomb = false;
                bombAmount += 1;
            }, 2000)
        }
    })
    
}

const handleBombExplosion = (bomb) => {
    // 1.destroy wall
    handleWallDestroy(bomb);
    // 2.destroy player
    handlePlayerDestroy(bomb);
    // 3.destroy enemy
    handleEnemyDestroy(bomb);
    // 4.destroy bonus
}   
   

const handleWallDestroy = (bomb) => {
    for(let i = 1; i <= bombRadius; i++) {
        if (bomb.bombIndex % widthField !== widthField - 1 && arrWall[bomb.bombIndex + i] || arrStone[bomb.bombIndex + i]) {
            wallDestroy(bomb.bombIndex + i);
            break;
        }
        
    }
    
    for(let i = 1; i <= bombRadius; i++) {
        if(bomb.bombIndex % widthField !== 0 && arrWall[bomb.bombIndex - i] || arrStone[bomb.bombIndex - i]) {
            wallDestroy(bomb.bombIndex - i)
            break;
        }
    }
    
    for(let i = 1; i <= bombRadius; i++) {
        if(arrWall[bomb.bombIndex + widthField * i] || arrStone[bomb.bombIndex + widthField * i]) {
            wallDestroy(bomb.bombIndex + widthField * i)
            break;
        }
    }
    
    for(let i = 1; i <= bombRadius; i++) {
        if(arrWall[bomb.bombIndex - widthField * i] || arrStone[bomb.bombIndex - widthField * i]) {
            wallDestroy(bomb.bombIndex - widthField * i)
            break;
        }
    }
    
}

const wallDestroy = (index) => {
    if(!arrWall[index]) return;

    arrWall[index].destroy({children: true});
    arrWall[index] = undefined;
    //add animation
    level1[index] = 'destroyWall';
    createDestroyWall();    
}

const createDestroyWall = () => {
    let wallX = 0;
    let wallY = 0;

    const wallDestroyContainer = new PIXI.Container();
     for(let i = 0; i < fieldSize; i++) {

        if(wallX === widthField) {
            wallY += 1;
            wallX = 0;
        }

        if(level1[i] === 'destroyWall') {
            const spriteDestroyWall = new PIXI.Sprite(destroyWall);
            spriteDestroyWall.width = sizeRect;
            spriteDestroyWall.height = sizeRect;
            spriteDestroyWall.x = wallX * sizeRect;
            spriteDestroyWall.y = wallY * sizeRect;

            
            wallDestroyContainer.addChild(spriteDestroyWall);

            setTimeout(() => {
                spriteDestroyWall.destroy({children: true})
                level1[i] = '';
            }, 800)
        }

        wallX += 1;
    }

    wallDestroyContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    wallDestroyContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    wallDestroyContainer.zIndex = 2;
    app.stage.addChild(wallDestroyContainer);
}

const enemyDestroyPlayer = (enemy) => {
    //todo implement lives
    if(player && bombermen.currentIndex === enemy.index) {
        console.log('hit');
        playerOff();
    }
}

const playerOff = () => {
    
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


const handlePlayerDestroy = (bomb) => {
    for(let i = 1; i <= bombRadius; i++) {
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

const playerLives = () => {
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
    
const createExplosionX = (bomb) => {
    const explosionContainer = new PIXI.Container();
    const explosion = new PIXI.Sprite(explosionSprite);
    explosion.width = sizeRect * explosionSize;
    explosion.height = sizeRect;
    explosionContainer.zIndex = 2;
    explosion.position.x = bomb.position.x - ((sizeRect - bomb.width) / 2) - sizeRect * bombRadius;
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
    explosion.height = sizeRect * explosionSize;
    explosionContainer.zIndex = 2;
    explosion.position.x = bomb.position.x - ((sizeRect - bomb.width) / 2);
    explosion.position.y = bomb.position.y - ((sizeRect - bomb.height)) - sizeRect * bombRadius;
    
    setTimeout(() => {
        explosion.destroy({children: true})
    }, 500)

    explosionContainer.addChild(explosion);
    app.stage.addChild(explosionContainer);
}

const createEnemy = (level) => {
    const enemyContainer = new PIXI.Container();

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

            moveEnemy(enemy)
        }

        enemyX += 1;
    }

    enemyContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    enemyContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    enemyContainer.zIndex = 2;

    app.stage.addChild(enemyContainer);
}

const moveEnemy = (enemy) => {
    let moveUp = true;
    let moveDown = false;
    let moveLeft = false;
    let moveRight = false;

    let moveValue = 0;
    let stepValue = 1;

    const enemyTick = () => {
    if(moveUp) {
            if(arrWall[enemy.index - widthField] || arrStone[enemy.index - widthField] || enemy.index - widthField < 0) {
                moveUp = false;
                moveDown = true;
                return;
            }
            

            enemy.y -= stepValue;
            moveValue += stepValue;
            
            if(moveValue >= sizeRect) {
                enemy.index -= widthField;
                moveValue = 0;

                if(!arrWall[enemy.index - 1] && !arrStone[enemy.index - 1] && enemy.index % widthField !== 0) {
                    if (Math.round(Math.random()) === 0) {
                        moveUp = false;
                        moveLeft = true;
                        return;
                    }
                }
            }
            
        }

        if(moveDown) {
            if(arrWall[enemy.index + widthField] || arrStone[enemy.index + widthField] || enemy.index + widthField >= fieldSize) {
                moveDown = false;
                moveUp = true;
                return;
            }

            enemy.y += stepValue;
            moveValue += stepValue;

            if(moveValue >= sizeRect) {
                enemy.index += widthField;
                moveValue = 0;

                if(!arrWall[enemy.index + 1] && !arrStone[enemy.index + 1] && enemy.index % widthField !== widthField - 1) {
                    if (Math.round(Math.random()) === 0) {
                        moveDown = false;
                        moveRight = true;
                        return;
                    }
                }
            }

        }
        
        if(moveLeft) {
            if(arrWall[enemy.index - 1] || arrStone[enemy.index - 1] || enemy.index % widthField === 0) {
                moveLeft = false;
                moveRight = true;
                return;
            }

            enemy.x -= stepValue;
            moveValue += stepValue;

            if(moveValue >= sizeRect) {
                enemy.index -= 1;
                moveValue = 0;

                

                if(!arrWall[enemy.index + widthField] && !arrStone[enemy.index + widthField] && enemy.index + widthField < fieldSize) {
                    if (Math.round(Math.random()) === 0) {
                        moveLeft = false;
                        moveDown = true;
                        return;
                    }
                }
            }
        }

        if(moveRight) {
            if(arrWall[enemy.index + 1] || arrStone[enemy.index + 1] || enemy.index % widthField === widthField - 1) {
                moveRight = false;
                moveLeft = true;
                return;
            }

            enemy.x += stepValue;
            moveValue += stepValue;

            if(moveValue >= sizeRect) {
                enemy.index += 1;
                moveValue = 0;

                if(!arrWall[enemy.index - widthField] && !arrStone[enemy.index - widthField] && enemy.index - widthField >= 0) {
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

const handleEnemyDestroy = (bomb) => {

    const toRemove = [];

    for (let i = 0; i < enemies.length; i++) {
        for(let j = 1; j <= bombRadius; j++) {
            if (bomb.bombIndex % widthField !== widthField - 1 && enemies[i].index === bomb.bombIndex + j) {
                toRemove.push(enemies[i]);
            }
            if(bomb.bombIndex % widthField !== 0 && enemies[i].index === bomb.bombIndex - j) {
                toRemove.push(enemies[i]);
            }
            if(enemies[i].index === bomb.bombIndex + widthField * j) {
                toRemove.push(enemies[i]);
            }
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
}

console.log(enemies)

const destroyEnemy = (enemy) => {
    console.log('enemy hit');
    app.ticker.remove(enemy.tick);
    enemy.destroy({ children: true });
    enemies.splice(enemies.indexOf(enemy), 1);
    console.log(enemies);
}

const createDecor = () => {
    const decorContainer = new PIXI.Container();
    const decor1 = new PIXI.Sprite(decorSprite1);
    const decor2 = new PIXI.Sprite(decorSprite2);
   
    decor1.width = 200
    decor1.height = 100 
    decor2.width = 200
    decor2.height = 130 
    decor1.position.x = (bombermen.position.x - decor1.width) / 2;
    decor1.position.y = (widthField * sizeRect - decor1.height) / 2;
    decor2.position.x = (bombermen.position.x - decor1.width) / 2;
    decor2.position.y = bombermen.y;

    let value = 0;
    const stepValue = 0.01;
    const offset = 200;
    const decor1PositionY = decor1.position.y;

    app.ticker.add(() => {
        value += stepValue;
        decor1.position.y = decor1PositionY + offset * Math.cos(value);
    })

    decorContainer.addChild(decor1, decor2);
    app.stage.addChild(decorContainer);
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

const createBonus = (level, bonus) => {
    const bonusContainer = new PIXI.Container();
    let bonusExplosionIndex = 0;
    let bonusBombIndex = 0;

    const placeForBonus = [];
    for(let i = 0; i < level.length; i++) {
        if(level[i] === 'wall') {
            placeForBonus.push(i);
        }
    }

    for(let i = 0; i < bonus.length; i++) {
        if(bonus[i] === 'explosion+') {
            bonusExplosionIndex = placeForBonus[getRandomInt(placeForBonus.length - 1)];
            const bonusExplosion = new PIXI.Sprite({texture: bonusExplosionSprite});
            bonusExplosion.width = sizeRect;
            bonusExplosion.height = sizeRect;
            bonusExplosion.x = bonusExplosionIndex % widthField * sizeRect;
            bonusExplosion.y = Math.trunc(bonusExplosionIndex / widthField) * sizeRect;
            console.log(Math.trunc(bonusExplosionIndex / widthField)) * sizeRect;
            console.log('index', bonusExplosionIndex, placeForBonus)
            bonusesExplosion[bonusExplosionIndex] = bonusExplosion;
            bonusContainer.addChild(bonusExplosion);
            placeForBonus.splice(placeForBonus.indexOf(bonusExplosionIndex), 1);
        }

        if(bonus[i] === 'bomb+') {
            bonusBombIndex = placeForBonus[getRandomInt(placeForBonus.length - 1)];
            const bonusBomb = new PIXI.Sprite({texture: bonusBombSprite});
            bonusBomb.width = sizeRect;
            bonusBomb.height = sizeRect;
            bonusBomb.x = bonusBombIndex % widthField * sizeRect;
            bonusBomb.y = (Math.trunc(bonusBombIndex / widthField)) * sizeRect;
            console.log(Math.trunc(bonusBombIndex / widthField)) * sizeRect;
            bonusesBomb[bonusBombIndex] = bonusBomb;
            bonusContainer.addChild(bonusBomb);
            placeForBonus.splice(placeForBonus.indexOf(bonusBombIndex), 1);
            console.log('index', bonusBombIndex, placeForBonus);
        }
    }

    bonusContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    bonusContainer.y = (app.screen.height - heightField * sizeRect) / 2;
    bonusContainer.zIndex = 1.5;
    app.stage.addChild(bonusContainer);
}

const prepareLevelScene = (level, bonus) => {
    createStone(level);
    createWall(level);
    createEnemy(level);
    createBonus(level, bonus)
    
}

const createScene = () => {
    createField();
    createBombermen();
    createBomb();
    moveBombermen();
    createDecor();
    playerLives();
    prepareLevelScene(level1, bonusForLevel1);
    // getBonusExplosion();
}

createScene();




