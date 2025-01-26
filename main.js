const canvas = document.getElementById('mainCanvas');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

const ctx = canvas.getContext('2d');

const convos = [
    "Great! Do you think you can do it quicker?",
    "Try again with this one",
    "Yayyy, you did it again",
    "I'm impressed",
    "Sort this one for me, please?",
    "Thank you, Bubble Sort Algorithm"
]

class Scene {
    constructor(numColumns, canvasWidth, canvasHeight, gap) {
        this.numColumns = numColumns;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.gap = gap;
        this.centerWidth = canvasWidth * 0.5;
        this.centerHeight = canvasHeight * 0.5;
        this.startX = (canvasWidth - this.centerWidth) / 2;
        this.startY = (canvasHeight - this.centerHeight) / 2;
        this.totalGapWidth = (numColumns - 1) * gap;
        this.availableWidth = this.centerWidth - this.totalGapWidth;
        this.width = this.availableWidth / numColumns;
        this.columns = [];
        this.color = 'white';
        this.selector = new Selector(this);
        this.won = false;
        this.level = 0;

        this.generateColumns();
    }

    reload() {
        this.startX = (this.canvasWidth - this.centerWidth) / 2;
        this.startY = (this.canvasHeight - this.centerHeight) / 2;
        this.totalGapWidth = (this.numColumns - 1) * this.gap;
        this.availableWidth = this.centerWidth - this.totalGapWidth;
        this.width = this.availableWidth / this.numColumns;
        this.columns = [];
        this.color = 'white';
        this.selector = new Selector(this);
        this.won = false;
        this.level = 0;
    }

    generateColumns() {
        if ((canvas.width - (this.numColumns - 1) * this.gap) / this.numColumns < 1) {
            console.error("Too many columns or gap is too large to fit within the canvas.");
            return;
        }
    
        for (let i = 0; i < this.numColumns; i++) {
            const height = Math.random() * (canvas.height * 0.5)+1;
            this.columns.push(height);
        }
        if (this.isSorted()) {
            console.log("Already sorted");
            this.generateColumns();
            return;
        }
    
        this.draw();
    }
    
    getColumnXPosition(index) {
        return this.startX + index * (this.width + this.gap);
    }

    drawColumns() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (this.isSorted()) {
            this.color = 'green';
            this.won = true;
            if (this.level >= convos.length) {
                document.getElementById('convoText').innerHTML = convos[-1];
            }
            else {
                document.getElementById('convoText').innerHTML = convos[this.level];
            }
            this.level++;
            this.numColumns++;
        }
        for (let i = 0; i < this.numColumns; i++) {
            const x = this.startX + i * (this.width + this.gap)
            const height = this.columns[i];
            ctx.fillStyle = this.color;
            ctx.fillRect(x, this.startY + (this.centerHeight - height), this.width, height);
        }
    }

    draw() {
        this.drawColumns();
        this.selector.draw();
    }
    isSorted() {
        for (let i = 0; i < this.columns.length - 1; i++) {
            if (this.columns[i] > this.columns[i + 1]) {
                return false;
            }
        }
        return true;
    }
}

class Selector {
    constructor(scene) {
        this.scene = scene;
        this.index = 0;
        this.bracketHeight = 30;
    }

    draw() {
        const column1 = this.scene.columns[this.index];
        const column2 = this.scene.columns[this.index + 1];
        if (column1 === undefined || column2 === undefined) {
            return;
        }
        const x = this.scene.getColumnXPosition(this.index) - 10;
        const y = this.scene.startY + this.scene.centerHeight + 10;
        const bracketWidth = this.scene.width * 2 + this.scene.gap + 20;

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(x, y - this.bracketHeight);
        ctx.lineTo(x, y);
        ctx.lineTo(x + bracketWidth, y);
        ctx.lineTo(x + bracketWidth, y - this.bracketHeight);
        ctx.stroke();
    }

    moveRight() {
        this.index++;
        if (this.index >= this.scene.numColumns - 1) {
            this.index = 0;
        }
    }
    moveLeft() {
        this.index--;
        if (this.index < 0) {
            this.index = this.scene.numColumns - 1;
        }
    }

    flipColumns() {
        const temp = this.scene.columns[this.index];
        this.scene.columns[this.index] = this.scene.columns[this.index + 1];
        this.scene.columns[this.index + 1] = temp;
    }
}

let scene = new Scene(5, canvas.width, canvas.height, 20);

document.addEventListener('keydown', (event) => {
    if (!scene.won) {
        if (event.key === 'ArrowLeft') {
            scene.selector.moveLeft();
            scene.draw();
        }
        if (event.key === 'ArrowRight') {
            scene.selector.moveRight();
            scene.draw();
        }
        if (event.key === ' ') {
            if(!scene.won) {
                event.preventDefault();
                scene.selector.flipColumns();
                scene.draw();
            }
        }
    }
    else {
        if (event.key === ' ') {
            if(!scene.won) {
                event.preventDefault();
                scene.selector.flipColumns();
                scene.draw();
            }
            else {
                scene.columns = [];
                scene.color = 'white';
                scene.reload()
                scene.generateColumns();
                scene.won = false;
            }
        }
    }
});