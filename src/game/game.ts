//import { Background } from './background.js';

// TODO: Extract Keybindings in seperate input.ts?
const KEY_ACTIONS = new Map<string, () => void>([
    ['KeyD', () => console.log('jump')],
    ['KeyF', () => console.log('duck')],
    ['KeyG', () => console.log('dash')],
]);

export class Game{

    //background: Background; 
    score=0;
    speed=4;
    gameOver=false;

    constructor(private context: CanvasRenderingContext2D){
       this.listenForInput();
    }

    listenForInput(){
        window.addEventListener('keydown',e =>{
            if (e.repeat) return;
            const action = KEY_ACTIONS.get(e.code);
            if (action) action();
        })
    }

    update(){
        if(this.gameOver) return;
        //this.background.update();
        this.score++;
        if(this.score%5===0) this.speed+=0.5;
    }

    draw(){
        //this.background.draw();
        const { width, height } = this.context.canvas;
        this.context.clearRect(0, 0, width, height);

        this.context.fillStyle='#2d3436'; this.context.font='24px Arial';
        this.context.fillText('Score: '+this.score,20,40);
        if(this.gameOver){this.context.fillStyle='red'; this.context.font='40'}
    }
}