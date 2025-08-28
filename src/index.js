import * as PIXI from 'pixi.js';
import { clearField, createField} from './field';
import { bombermen, startBombermen, createBombermen, moveBombermen, playerLives, clearBombermen, livesText, clearPlayerLives } from './bomberman';
import { clearWall, createWall } from './wall';
import { clearStone, createStone } from './stone';
import { clearBonus, createBonus, teleportActive } from './bonuses';
import { createBomb, explosionContainer } from './bomb';
import { clearEnemy, createEnemy } from './enemy';
import { clearDecor, createDecor } from './decor';
import { gameOverActive } from './gameover';
import { addScore, clearScore, destroyLeaderBoard, leaderBoard, scoreRender, scores, scoreText } from './score';
import { clearLevel, clearNextLevel, currentLevel, level, nextLevelUp } from './level';
import { winner } from './winner';

export const app = new PIXI.Application();


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
    score: 0,
    playerName: '?',
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

export const startNewLevel = () => {
    clearScene();
    if(gameState.level === 2) {
        prepareLevelScene(level2, bonusForLevel2);
    }
    if(gameState.level === 3) {
        prepareLevelScene(level3, bonusForLevel3);
    }
    if(gameState.level === 4) {
        clearField();
        clearDecor();
        clearLevel();
        clearNextLevel();
        clearPlayerLives();
        clearBombermen();
        destroyLeaderBoard();
        clearScore();
        winner();
    }
    
}

const createScene = async () => {
    await app.init({
    background: '#000000ff',
    antialias: true,
    width: window.innerWidth,
    height: window.innerHeight,
})

document.body.appendChild(app.canvas);
app.stage.sortableChildren = true;
    createField();
    createBombermen();
    moveBombermen();
    createDecor();
    playerLives();
    prepareLevelScene(level1, bonusForLevel1);
    createBomb();
    scoreRender();
    leaderBoard();
    currentLevel();
    nextLevelUp();
    console.log('scoresData', scores);
    // winner();
}

createScene();

const gameLoop = () => {
    if (gameState.startLevel2) {
        startNewLevel();
        gameState.startLevel2 = false;
        gameState.teleportActive = false;
        teleportActive();
        console.log(gameState.teleportActive);
        level.text = `Level: ${gameState.level}`;
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
    explosionContainer.visible = false;
    clearWall();
    clearBonus();
    clearBombermen();
    clearStone();
    clearEnemy();
    clearField();
    clearNextLevel();
    gameOverActive();
    
    destroyLeaderBoard();
}

export const createRestartScene = () => {
    createField();
    createBombermen();
    prepareLevelScene(level1, bonusForLevel1);
    addScore();
    leaderBoard();
    nextLevelUp();
    livesText.text = `= ${gameState.livesAmount}`
    bombState.bombAmount = 1;
    bombState.bombRadius = 1;
    bombState.explosionSize = 3;
    gameState.level = 1;
    gameState.score = 0;
    scoreText.text = `Score: ${gameState.score}`;
    level.text = `Level: ${gameState.level}`;
}







