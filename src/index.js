import * as PIXI from 'pixi.js';
import { createField} from './field';
import { createBombermen, moveBombermen, playerLives } from './bomberman';
import { createWall } from './wall';
import { createStone } from './stone';
import { createBonus } from './bonuses';
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
  '', 'wall', 'wall', '', 'enemy', '', 'wall', 'wall', '', '', 'wall', '', 'enemy'
];

export const bonusMapping = {
    explosionPlus : 'explosion+',
    bombPlus : 'bomb+',
}
const bonusForLevel1 = [bonusMapping.explosionPlus, bonusMapping.bombPlus];

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

const createScene = () => {
    createField();
    createBombermen();
    createBomb();
    moveBombermen();
    createDecor();
    playerLives();
    prepareLevelScene(level1, bonusForLevel1);
}

createScene();




