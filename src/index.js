import * as PIXI from 'pixi.js';
import { clearField, createField} from './field';
import { bombermen, startBombermen, createBombermen, moveBombermen, playerLives, clearBombermen, livesText } from './bomberman';
import { clearWall, createWall } from './wall';
import { clearStone, createStone } from './stone';
import { clearBonus, createBonus } from './bonuses';
import { createBomb } from './bomb';
import { clearEnemy, createEnemy } from './enemy';
import { createDecor } from './decor';
import { gameOverActive } from './gameover';

export const app = new PIXI.Application();
await app.init({
    background: '#000000ff',
    antialias: true,
    width: window.innerWidth,
    height: window.innerHeight,
})

document.body.appendChild(app.canvas);
app.stage.sortableChildren = true;

export const level1 = [
  '', '', 'wall', 'wall', '', '', 'wall', '', '', 'wall', 'wall', '', 'enemy',
  '', 'stone', '', 'stone', '', 'stone', '', 'stone', 'wall', 'stone', '', 'stone', '',
  '', '', '', '', '', '', 'wall', '', '', '', 'wall', '', 'wall',
  'wall', 'stone', 'wall', 'stone', 'wall', 'stone', 'wall', 'stone', '', 'stone', 'wall', 'stone', 'wall',
  'wall', '', 'wall', '', '', '', '', '', '', '', 'wall', '', '',
  '', 'stone', '', 'stone', '', 'stone', '', 'stone', '', 'stone', '', 'stone', '',
  '', '', '', '', 'wall', '', '', '', 'wall', '', '', '', '',
  '', 'stone', '', 'stone', '', 'stone', 'wall', 'stone', '', 'stone', 'wall', 'stone', '',
  'wall', 'wall', 'wall', '', 'enemy', '', 'wall', 'wall', '', '', 'wall', 'wall', 'enemy'
];

export const level2 = [
  '', '', '', 'wall', 'wall', 'wall', 'wall', '', '', '', '', '', 'enemy',
  '', 'stone', '', 'stone', '', 'stone', 'wall', 'stone', 'wall', 'stone', 'wall', 'stone', '',
  '', 'wall', 'wall', 'wall', 'wall', '', '', '', '', '', '', '', 'speedster',
  'wall', 'stone', 'wall', 'stone', '', 'stone', 'wall', 'stone', '', 'stone', 'wall', 'stone', 'wall',
  'wall', '', 'wall', '', '', 'wall', 'wall', 'wall', 'wall', '', '', '', '',
  'wall', 'stone', '', 'stone', '', 'stone', '', 'stone', '', 'stone', '', 'stone', '',
  '', '', '', '', 'wall', '', '', '', 'wall', '', 'ghost', '', '',
  '', 'stone', '', 'stone', '', 'stone', 'wall', 'stone', 'wall', 'stone', 'wall', 'stone', '',
  'wall', 'wall', 'wall', '', 'enemy', '', '', '', '', '', '', '', 'enemy'
];

export const level3 = [
  '', '', '', '', '', '', 'wall', 'wall', 'wall', 'enemy', '', 'wall', 'wall',
  'wall', 'stone', 'wall', 'stone', 'wall', 'stone', 'wall', 'stone', 'wall', 'stone', 'wall', 'stone', 'wall',
  'wall', '', '', '', 'wall', 'wall', 'wall', '', '', '', '', '', 'speedster',
  'wall', 'stone', 'wall', 'stone', '', 'stone', '', 'stone', '', 'stone', 'wall', 'stone', 'wall',
  'wall', '', 'wall', '', '', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'speedster',
  'wall', 'stone', '', 'stone', '', 'stone', '', 'stone', '', 'stone', '', 'stone', '',
  '', '', 'ghost', '', 'wall', '', '', '', 'wall', '', 'ghost', '', '',
  '', 'stone', '', 'stone', '', 'stone', 'wall', 'stone', 'wall', 'stone', 'wall', 'stone', '',
  'wall', 'wall', 'wall', '', 'speedster', '', '', '', '', '', '', '', 'ghost'
];

export const bonusMapping = {
    explosionPlus : 'explosion+',
    bombPlus : 'bomb+',
    hp: 'hp',
    teleport: 'teleport',
}
const bonusForLevel1 = [bonusMapping.explosionPlus, bonusMapping.bombPlus, bonusMapping.teleport];
const bonusForLevel2 = [bonusMapping.explosionPlus, bonusMapping.bombPlus, bonusMapping.teleport];
const bonusForLevel3 = [bonusMapping.explosionPlus, bonusMapping.bombPlus, bonusMapping.teleport, bonusMapping.hp];

export const gameState = {
    teleportActive: false,
    startLevel2: false,
    livesAmount: 5,
    level: 1,
}

export const bombState = {
    bombAmount: 1,
    bombRadius: 1,
    explosionSize: 3,
}

const prepareLevelScene = (levelTemplate, bonusTemplate) => {
    createStone(levelTemplate);
    createWall(levelTemplate);
    createEnemy(levelTemplate);
    createBonus(levelTemplate, bonusTemplate);
}

const startNewLevel2 = () => {
    clearScene();
    if(gameState.level === 2) {
        prepareLevelScene(level2, bonusForLevel2);
    }
    if(gameState.level === 3) {
        prepareLevelScene(level3, bonusForLevel3);
    }
    
}

const createScene = () => {
    createField();
    createBombermen();
    moveBombermen();
    createDecor();
    playerLives();
    prepareLevelScene(level1, bonusForLevel1);
    createBomb();
}

createScene();

const gameLoop = () => {
    if (gameState.startLevel2) {
        startNewLevel2();
        gameState.startLevel2 = false;
        gameState.teleportActive = false;
        console.log(gameState.teleportActive);
    }

    if (gameState.livesAmount === 0) {
        gameOver();
        gameState.livesAmount = 5;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

const clearScene = () => {
    startBombermen();
    clearWall();
    clearStone();
    clearBonus();
}

const gameOver = () => {
    clearWall();
    clearBonus();
    clearBombermen();
    clearStone();
    clearEnemy();
    clearField();
    gameOverActive();
}

export const createRestartScene = () => {
    createField();
    createBombermen();
    prepareLevelScene(level1, bonusForLevel1);
    livesText.text = `= ${gameState.livesAmount}`;
    bombState.bombAmount = 1;
    bombState.bombRadius = 1;
    bombState.explosionSize = 3;
    gameState.level = 1;
}

// gameOver()


// createField();
// prepareLevelScene(level1, bonusForLevel1);
// createBombermen();





