// TODO: Display Floor and Ceiling Correctly
export class Corridor {
    groundOffset = 0;

    constructor(public context: CanvasRenderingContext2D, public speed: number) {

    }

    update() {
        this.groundOffset -= this.speed;
    }

    draw() {
        //sky
        const gradient = this.context.createLinearGradient(0,0,0,450);
        gradient.addColorStop(0, '#74ebd5'); gradient.addColorStop(1, '#ACB6E5');
        this.context.fillStyle = gradient; this.context.fillRect(0,0,0,450);

        //ground
        this.context.fillStyle='#7ec850';
        this.context.fillRect(this.groundOffset%900, 450-40, 900, 40);
        this.context.fillRect((this.groundOffset%900)+900, 450-40, 900, 40);
    }
}