/// <reference path="../node_modules/@types/p5/global.d.ts" />

class SNOWFALL_CHASE {
    width = windowWidth;
    height = windowHeight;
    protected ellipseArr: any[] = [];
    bgImage: any = null;
    hitsItemArr: any[] = [];
    hitsItemCount = 0;
    hitsItemLimit = 680;
    hitsItemSize = 20;
    hitsItemSpacing = 5;
    snowBallMoving = false;
    crashed = false;
    gameOver = false;
    boardOptions = {
        left: floor((this.width - 700) / 2),
        top: floor((this.height - 700) / 2),
        boardWidth: 700,
        boardHeight: 700,
        borderRadius: 0
    };
    hitBoardOptions = {
        hitLeft: floor((this.width - 700) / 2) + 250,
        hitTop: floor((this.height - 700) / 2) + 650,
        hitBoardWidth: 200,
        hitBoardHeight: 20,
        hitBorderRadius: 0,
        speed: 10
    };
    snowBallOptions = {
        x: this.hitBoardOptions.hitLeft + this.hitBoardOptions.hitBoardWidth / 2,
        y: this.hitBoardOptions.hitTop + this.hitBoardOptions.hitBoardHeight / 2 - this.hitBoardOptions.hitBoardHeight - this.hitsItemSpacing,
        snowBallDiameter: 20,
        speedX: 2,
        speedY: 8
    };

    preloadBackground() {
        this.bgImage = loadImage('https://i.redd.it/y4iy0n11q25a1.jpg');
    }

    drawBackground() {
        image(this.bgImage, 0, 0, windowWidth - 18, windowHeight);
    }

    createCanvas() {
        createCanvas(windowWidth - 18, windowHeight - 10);
    }

    snowEffect() {
        const snowData = {
            width: 5,
            height: 5,
            left: floor(random(0, this.width)),
            top: -floor(random(0, 100)),
            speed: 1 + random(2)
        };

        this.ellipseArr.push(snowData);

        let tempArr = [];

        for (const elem of this.ellipseArr) {
            elem.top += floor(elem.speed);
            elem.left += floor(random(0, 1));

            if (elem.top > this.boardOptions.top && elem.top < this.boardOptions.top + this.boardOptions.boardHeight &&
                elem.left > this.boardOptions.left && elem.left < this.boardOptions.left + this.boardOptions.boardWidth) {
                // Do something
            } else {
                fill('#fff');
                tempArr.push(elem);
            }

            ellipse(elem.left, elem.top, elem.width, elem.height);
            noStroke();
        }

        this.ellipseArr = tempArr;
        this.ellipseArr = this.ellipseArr.filter(elem => elem.top < this.height);
    }

    createBoard() {
        push();
        fill(0);
        rect(this.boardOptions.left, this.boardOptions.top, this.boardOptions.boardWidth, this.boardOptions.boardHeight, this.boardOptions.borderRadius);
        pop();
        this.createHitBoard();
    }

    createHitBoard() {
        fill(255);
        rect(this.hitBoardOptions.hitLeft, this.hitBoardOptions.hitTop, this.hitBoardOptions.hitBoardWidth, this.hitBoardOptions.hitBoardHeight, this.hitBoardOptions.hitBorderRadius);

        if (keyIsDown(LEFT_ARROW)) {
            this.hitBoardOptions.hitLeft -= this.hitBoardOptions.speed;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.hitBoardOptions.hitLeft += this.hitBoardOptions.speed;
        }
        if (this.hitBoardOptions.hitLeft < this.boardOptions.left) {
            this.hitBoardOptions.hitLeft = this.boardOptions.left;
        }
        if (this.hitBoardOptions.hitLeft + this.hitBoardOptions.hitBoardWidth > this.boardOptions.left + this.boardOptions.boardWidth) {
            this.hitBoardOptions.hitLeft = this.boardOptions.left + this.boardOptions.boardWidth - this.hitBoardOptions.hitBoardWidth;
        }
    }

    createHitsItem() {
        if (this.hitsItemArr.length === 0) {
            const cols = Math.floor(this.boardOptions.boardWidth / (this.hitsItemSize + this.hitsItemSpacing));
            const remainingSpace = this.boardOptions.boardWidth - (cols * this.hitsItemSize + (cols - 1) * this.hitsItemSpacing);
            const adjustedSpacing = this.hitsItemSpacing + remainingSpace / (cols - 1);
            const rows = 5;

            const patterns: ((col: number, row: number) => boolean)[] = [
                (col: number, row: number) => true,
                (col: number, row: number) => row % 2 === 0,
                (col: number, row: number) => col === 0 || col === cols - 1,
                (col: number, row: number) => (col + row) % 2 === 0,
                (col: number, row: number) => col === row,
                (col: number, row: number) => col >= row && col < cols - row,
                (col: number, row: number) => row === 0 || row === rows - 1 || col === 0 || col === cols - 1,
                (col: number, row: number) => col === row || col === cols - row - 1,
                (col: number, row: number) => Math.random() > 0.5,
                (col: number, row: number) => col >= row && col % 2 === 0,
                (col: number, row: number) => (row === 0 || col === 0) || (col === cols - 1 || row === rows - 1),
                (col: number, row: number) => col % 3 === 0 && row % 3 === 0,
                (col: number, row: number) => col % 2 === 0 && row % 3 === 0,
                (col: number, row: number) => (col + row) % 3 === 0,
                (col: number, row: number) => col > row && col < cols - row - 1,
                (col: number, row: number) => row < rows / 2,
                (col: number, row: number) => col > cols / 2,
                (col: number, row: number) => row === col || row === cols - col - 1,
                (col: number, row: number) => col % 2 === 1 && row % 2 === 1,
                (col: number, row: number) => col > Math.floor(cols / 4) && col < Math.floor(3 * cols / 4) && row > Math.floor(rows / 4) && row < Math.floor(3 * rows / 4)
            ];

            const pattern = random(patterns);

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (pattern(col, row)) {
                        const x = this.boardOptions.left + col * (this.hitsItemSize + adjustedSpacing);
                        const y = this.boardOptions.top + row * (this.hitsItemSize + adjustedSpacing);
                        this.hitsItemArr.push({ x, y });
                    }
                }
            }
        }

        for (const item of this.hitsItemArr) {
            fill(255);
            rect(item.x, item.y, this.hitsItemSize, this.hitsItemSize);
        }

        this.createSnowBall();
    }

    createSnowBall() {
        if (this.gameOver) {
            return;
        }

        fill('#fff');
        ellipse(this.snowBallOptions.x, this.snowBallOptions.y, this.snowBallOptions.snowBallDiameter, this.snowBallOptions.snowBallDiameter);

        if (this.snowBallMoving) {
            this.snowBallOptions.y += this.snowBallOptions.speedY;
            this.snowBallOptions.x += this.snowBallOptions.speedX;

            if (
                this.snowBallOptions.y + this.snowBallOptions.snowBallDiameter / 2 >= this.hitBoardOptions.hitTop &&
                this.snowBallOptions.y - this.snowBallOptions.snowBallDiameter / 2 <= this.hitBoardOptions.hitTop + this.hitBoardOptions.hitBoardHeight &&
                this.snowBallOptions.x + this.snowBallOptions.snowBallDiameter / 2 >= this.hitBoardOptions.hitLeft &&
                this.snowBallOptions.x - this.snowBallOptions.snowBallDiameter / 2 <= this.hitBoardOptions.hitLeft + this.hitBoardOptions.hitBoardWidth
            ) {
                this.snowBallOptions.y = this.hitBoardOptions.hitTop - this.snowBallOptions.snowBallDiameter / 2;
                this.snowBallOptions.speedY = -this.snowBallOptions.speedY;
            }


            for (let index = 0; index < this.hitsItemArr.length; index++) {
                const element = this.hitsItemArr[index];
                const distance = dist(this.snowBallOptions.x, this.snowBallOptions.y, element.x + this.hitsItemSize / 2, element.y + this.hitsItemSize / 2);
                if (distance < this.snowBallOptions.snowBallDiameter / 2 + this.hitsItemSize / 2) {
                    this.hitsItemArr.splice(index, 1);
                    this.snowBallOptions.speedY = -this.snowBallOptions.speedY;
                    break;
                }
            }

            // left top right border of boardoptions
            if (this.snowBallOptions.x - this.snowBallOptions.snowBallDiameter / 2 <= this.boardOptions.left ||
                this.snowBallOptions.x + this.snowBallOptions.snowBallDiameter / 2 >= this.boardOptions.left + this.boardOptions.boardWidth) {
                this.snowBallOptions.speedX = -this.snowBallOptions.speedX;
            }
            if (this.snowBallOptions.y - this.snowBallOptions.snowBallDiameter / 2 <= this.boardOptions.top) {
                this.snowBallOptions.speedY = -this.snowBallOptions.speedY;
            }

            // Game Over 
            if (this.snowBallOptions.y - this.snowBallOptions.snowBallDiameter / 2 > this.height) {
                this.gameOver = true;
                this.snowBallMoving = false;
            }
        }
    }

    resetSnowBall() {
        this.snowBallOptions.x = this.hitBoardOptions.hitLeft + this.hitBoardOptions.hitBoardWidth / 2;
        this.snowBallOptions.y = this.hitBoardOptions.hitTop + this.hitBoardOptions.hitBoardHeight / 2 - this.hitBoardOptions.hitBoardHeight - this.hitsItemSpacing;
        this.snowBallOptions.speedY = abs(this.snowBallOptions.speedY);
        this.snowBallOptions.speedX = random(-2, 2);
        this.crashed = false;
        this.gameOver = false;
    }

    handleKeyPressed() {
        if (keyCode === 32) {
            this.snowBallMoving = true;
        }
    }
}

let snowFallChase: SNOWFALL_CHASE;

function preload() {
    snowFallChase = new SNOWFALL_CHASE();
    snowFallChase.preloadBackground();
}

function setup() {
    snowFallChase.createCanvas();
}

function draw() {
    if (snowFallChase.gameOver) {
        snowFallChase.drawBackground();
        snowFallChase.createBoard();
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Game Over", snowFallChase.boardOptions.left + snowFallChase.boardOptions.boardWidth / 2, snowFallChase.boardOptions.top + snowFallChase.boardOptions.boardHeight / 2);
    } else {
        snowFallChase.drawBackground();
        snowFallChase.snowEffect();
        snowFallChase.createBoard();
        snowFallChase.createHitsItem();
    }
}

function keyPressed() {
    snowFallChase.handleKeyPressed();
}
