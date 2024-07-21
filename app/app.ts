/// <reference path="../node_modules/@types/p5/global.d.ts" />

class BALL {
    width = windowWidth;
    height = windowHeight;
    protected ellipseArr: any[] = [];
    bgImage: any = null;
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
        hitBoardHeight: 30,
        hitBorderRadius: 0,
        speed: 10
    };
    hitsItemArr: any[] = [];
    hitsItemCount = 0;
    hitsItemLimit = 680;
    hitsItemSize = 20;
    hitsItemSpacing = 5;

    preloadBackground() {
        this.bgImage = loadImage('https://i.redd.it/y4iy0n11q25a1.jpg');
    }

    drawBackground() {
        image(this.bgImage, 0, 0, windowWidth - 18, windowHeight);
    }

    createCanvas() {
        createCanvas(windowWidth - 18, windowHeight);
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
        const cols = Math.floor(this.boardOptions.boardWidth / (this.hitsItemSize + this.hitsItemSpacing));
        const remainingSpace = this.boardOptions.boardWidth - (cols * this.hitsItemSize + (cols - 1) * this.hitsItemSpacing);
        const adjustedSpacing = this.hitsItemSpacing + remainingSpace / (cols - 1);
        const rows = 3;

        if (this.hitsItemArr.length < cols * rows) {
            for (let i = 0; i < cols * rows; i++) {
                const x = this.boardOptions.left + (i % cols) * (this.hitsItemSize + adjustedSpacing);
                const y = this.boardOptions.top + Math.floor(i / cols) * (this.hitsItemSize + adjustedSpacing);
                this.hitsItemArr.push({ x, y });
            }
        }

        for (const item of this.hitsItemArr) {
            fill(255);
            rect(item.x, item.y, this.hitsItemSize, this.hitsItemSize);
        }
    }
}

let ball: BALL;

function preload() {
    ball = new BALL();
    ball.preloadBackground();
}

function setup() {
    ball.createCanvas();
}

function draw() {
    ball.drawBackground();
    ball.createBoard();
    ball.snowEffect();
    ball.createHitsItem();
}
