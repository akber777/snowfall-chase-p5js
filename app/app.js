"use strict";
/// <reference path="../node_modules/@types/p5/global.d.ts" />
var SNOWFALL_CHASE = /** @class */ (function () {
    function SNOWFALL_CHASE() {
        this.width = windowWidth;
        this.height = windowHeight;
        this.ellipseArr = [];
        this.bgImage = null;
        this.hitsItemArr = [];
        this.hitsItemCount = 0;
        this.hitsItemLimit = 680;
        this.hitsItemSize = 20;
        this.hitsItemSpacing = 5;
        this.snowBallMoving = false;
        this.crashed = false;
        this.gameOver = false;
        this.boardOptions = {
            left: floor((this.width - 700) / 2),
            top: floor((this.height - 700) / 2),
            boardWidth: 700,
            boardHeight: 700,
            borderRadius: 0
        };
        this.hitBoardOptions = {
            hitLeft: floor((this.width - 700) / 2) + 250,
            hitTop: floor((this.height - 700) / 2) + 650,
            hitBoardWidth: 200,
            hitBoardHeight: 20,
            hitBorderRadius: 0,
            speed: 10
        };
        this.snowBallOptions = {
            x: this.hitBoardOptions.hitLeft + this.hitBoardOptions.hitBoardWidth / 2,
            y: this.hitBoardOptions.hitTop + this.hitBoardOptions.hitBoardHeight / 2 - this.hitBoardOptions.hitBoardHeight - this.hitsItemSpacing,
            snowBallDiameter: 20,
            speedX: 2,
            speedY: 8
        };
    }
    SNOWFALL_CHASE.prototype.preloadBackground = function () {
        this.bgImage = loadImage('https://i.redd.it/y4iy0n11q25a1.jpg');
    };
    SNOWFALL_CHASE.prototype.drawBackground = function () {
        image(this.bgImage, 0, 0, windowWidth - 18, windowHeight);
    };
    SNOWFALL_CHASE.prototype.createCanvas = function () {
        createCanvas(windowWidth - 18, windowHeight - 10);
    };
    SNOWFALL_CHASE.prototype.snowEffect = function () {
        var _this = this;
        var snowData = {
            width: 5,
            height: 5,
            left: floor(random(0, this.width)),
            top: -floor(random(0, 100)),
            speed: 1 + random(2)
        };
        this.ellipseArr.push(snowData);
        var tempArr = [];
        for (var _i = 0, _a = this.ellipseArr; _i < _a.length; _i++) {
            var elem = _a[_i];
            elem.top += floor(elem.speed);
            elem.left += floor(random(0, 1));
            if (elem.top > this.boardOptions.top && elem.top < this.boardOptions.top + this.boardOptions.boardHeight &&
                elem.left > this.boardOptions.left && elem.left < this.boardOptions.left + this.boardOptions.boardWidth) {
                // Do something
            }
            else {
                fill('#fff');
                tempArr.push(elem);
            }
            ellipse(elem.left, elem.top, elem.width, elem.height);
            noStroke();
        }
        this.ellipseArr = tempArr;
        this.ellipseArr = this.ellipseArr.filter(function (elem) { return elem.top < _this.height; });
    };
    SNOWFALL_CHASE.prototype.createBoard = function () {
        push();
        fill(0);
        rect(this.boardOptions.left, this.boardOptions.top, this.boardOptions.boardWidth, this.boardOptions.boardHeight, this.boardOptions.borderRadius);
        pop();
        this.createHitBoard();
    };
    SNOWFALL_CHASE.prototype.createHitBoard = function () {
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
    };
    SNOWFALL_CHASE.prototype.createHitsItem = function () {
        if (this.hitsItemArr.length === 0) {
            var cols_1 = Math.floor(this.boardOptions.boardWidth / (this.hitsItemSize + this.hitsItemSpacing));
            var remainingSpace = this.boardOptions.boardWidth - (cols_1 * this.hitsItemSize + (cols_1 - 1) * this.hitsItemSpacing);
            var adjustedSpacing = this.hitsItemSpacing + remainingSpace / (cols_1 - 1);
            var rows_1 = 5;
            var patterns = [
                function (col, row) { return true; },
                function (col, row) { return row % 2 === 0; },
                function (col, row) { return col === 0 || col === cols_1 - 1; },
                function (col, row) { return (col + row) % 2 === 0; },
                function (col, row) { return col === row; },
                function (col, row) { return col >= row && col < cols_1 - row; },
                function (col, row) { return row === 0 || row === rows_1 - 1 || col === 0 || col === cols_1 - 1; },
                function (col, row) { return col === row || col === cols_1 - row - 1; },
                function (col, row) { return Math.random() > 0.5; },
                function (col, row) { return col >= row && col % 2 === 0; },
                function (col, row) { return (row === 0 || col === 0) || (col === cols_1 - 1 || row === rows_1 - 1); },
                function (col, row) { return col % 3 === 0 && row % 3 === 0; },
                function (col, row) { return col % 2 === 0 && row % 3 === 0; },
                function (col, row) { return (col + row) % 3 === 0; },
                function (col, row) { return col > row && col < cols_1 - row - 1; },
                function (col, row) { return row < rows_1 / 2; },
                function (col, row) { return col > cols_1 / 2; },
                function (col, row) { return row === col || row === cols_1 - col - 1; },
                function (col, row) { return col % 2 === 1 && row % 2 === 1; },
                function (col, row) { return col > Math.floor(cols_1 / 4) && col < Math.floor(3 * cols_1 / 4) && row > Math.floor(rows_1 / 4) && row < Math.floor(3 * rows_1 / 4); }
            ];
            var pattern = random(patterns);
            for (var row = 0; row < rows_1; row++) {
                for (var col = 0; col < cols_1; col++) {
                    if (pattern(col, row)) {
                        var x = this.boardOptions.left + col * (this.hitsItemSize + adjustedSpacing);
                        var y = this.boardOptions.top + row * (this.hitsItemSize + adjustedSpacing);
                        this.hitsItemArr.push({ x: x, y: y });
                    }
                }
            }
        }
        for (var _i = 0, _a = this.hitsItemArr; _i < _a.length; _i++) {
            var item = _a[_i];
            fill(255);
            rect(item.x, item.y, this.hitsItemSize, this.hitsItemSize);
        }
        this.createSnowBall();
    };
    SNOWFALL_CHASE.prototype.createSnowBall = function () {
        if (this.gameOver) {
            return;
        }
        fill('#fff');
        ellipse(this.snowBallOptions.x, this.snowBallOptions.y, this.snowBallOptions.snowBallDiameter, this.snowBallOptions.snowBallDiameter);
        if (this.snowBallMoving) {
            this.snowBallOptions.y += this.snowBallOptions.speedY;
            this.snowBallOptions.x += this.snowBallOptions.speedX;
            if (this.snowBallOptions.y + this.snowBallOptions.snowBallDiameter / 2 >= this.hitBoardOptions.hitTop &&
                this.snowBallOptions.y - this.snowBallOptions.snowBallDiameter / 2 <= this.hitBoardOptions.hitTop + this.hitBoardOptions.hitBoardHeight &&
                this.snowBallOptions.x + this.snowBallOptions.snowBallDiameter / 2 >= this.hitBoardOptions.hitLeft &&
                this.snowBallOptions.x - this.snowBallOptions.snowBallDiameter / 2 <= this.hitBoardOptions.hitLeft + this.hitBoardOptions.hitBoardWidth) {
                this.snowBallOptions.y = this.hitBoardOptions.hitTop - this.snowBallOptions.snowBallDiameter / 2;
                this.snowBallOptions.speedY = -this.snowBallOptions.speedY;
            }
            for (var index = 0; index < this.hitsItemArr.length; index++) {
                var element = this.hitsItemArr[index];
                var distance = dist(this.snowBallOptions.x, this.snowBallOptions.y, element.x + this.hitsItemSize / 2, element.y + this.hitsItemSize / 2);
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
    };
    SNOWFALL_CHASE.prototype.resetSnowBall = function () {
        this.snowBallOptions.x = this.hitBoardOptions.hitLeft + this.hitBoardOptions.hitBoardWidth / 2;
        this.snowBallOptions.y = this.hitBoardOptions.hitTop + this.hitBoardOptions.hitBoardHeight / 2 - this.hitBoardOptions.hitBoardHeight - this.hitsItemSpacing;
        this.snowBallOptions.speedY = abs(this.snowBallOptions.speedY);
        this.snowBallOptions.speedX = random(-2, 2);
        this.crashed = false;
        this.gameOver = false;
    };
    SNOWFALL_CHASE.prototype.handleKeyPressed = function () {
        if (keyCode === 32) {
            this.snowBallMoving = true;
        }
    };
    return SNOWFALL_CHASE;
}());
var snowFallChase;
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
    }
    else {
        snowFallChase.drawBackground();
        snowFallChase.snowEffect();
        snowFallChase.createBoard();
        snowFallChase.createHitsItem();
    }
}
function keyPressed() {
    snowFallChase.handleKeyPressed();
}
