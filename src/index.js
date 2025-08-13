import * as PIXI from 'pixi.js';
import { createField} from './field';
import { bombermen, clearBombermen, createBombermen, moveBombermen, playerLives } from './bomberman';
import { clearWall, createWall } from './wall';
import { createStone } from './stone';
import { clearBonus, createBonus } from './bonuses';
import { createBomb } from './bomb';
import { createEnemy } from './enemy';
import { createDecor } from './decor';

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
  'wall', 'wall', 'wall', '', 'enemy', '', 'wall', 'wall', '', '', 'wall', '', 'enemy'
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

export const bonusMapping = {
    explosionPlus : 'explosion+',
    bombPlus : 'bomb+',
    teleport: 'teleport',
}
const bonusForLevel1 = [bonusMapping.explosionPlus, bonusMapping.bombPlus, bonusMapping.teleport];
const bonusForLevel2 = [bonusMapping.explosionPlus, bonusMapping.bombPlus, bonusMapping.teleport];

export const gameState = {
    teleportActive: false,
    startLevel2: false,
}
// console.log(gameState.teleportActive)

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
    prepareLevelScene(level2, bonusForLevel2);
    
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
        console.log(gameState.teleportActive)
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

const clearScene = () => {
    clearBombermen();
    clearWall();
    clearBonus();
}




