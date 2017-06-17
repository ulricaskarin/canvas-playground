(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Socket client-side functionality.
 *
 * @author Ulrica Skarin
 * @version 1.0.0
 */

'use strict';

let Breakout = require('./games/Breakout.js');

// Constants:
const CONNECT_ERROR = 'Error connecting to socket.io.',
    RECONNECT_FAILURE = 'Failing to reconnect to socket.io. Giving up!';

/**
 * Socket constructor.
 * @constructor
 */
function Socket() {

    this.socket = io({
        'reconnection': true,
        'reconnectionDelay': 500,
        'reconnectionAttempts': 5
    });

    this.startUp();
}

/**
 * Starts Socket functionality.
 */
Socket.prototype.startUp = function() {

    this.socket.on('connect_error', () => {
        console.warn(`${CONNECT_ERROR}`);
    });
    this.socket.on('reconnect_failed', () =>  {
        console.error(`${RECONNECT_FAILURE}`);
    });
    this.socket.on('breakout', () =>  {
        console.log('breakout game called');
        new Breakout();
    });
};

module.exports = Socket;
},{"./games/Breakout.js":3}],2:[function(require,module,exports){
/**
 * App.js - sets of client-side JS functionality.
 *
 * @author Ulrica Skarin
 * @version 1.0.0
 */

'use strict';

let Socket = require('./Socket.js');

(function start() {

    try{
        new Socket();

        if (localStorage) {

            if(localStorage.getItem('highscore')){

                // Highscore handling etc.
            }
        }
    } catch (e) {
        console.log(`${e}`);
    }
})();
},{"./Socket.js":1}],3:[function(require,module,exports){
/**
 * Breakout Game.
 *
 * @author Ulrica Skarin
 * @version 1.0.0
 */

'use strict';

/**
 * Breakout constructor.
 * @constructor
 */
function Breakout() {


    this.canvas = document.querySelector('#canvas-breakout');
    this.ctx = this.canvas.getContext('2d');

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height -30;
    this.dx = 2;
    this.dy = -2;

    this.boundaries = this.canvas.getBoundingClientRect();
    this.offsetX = this.boundaries.left;

    this.ballRadius = 15;
    this.paddleHeight = 10;
    this.paddleWidth = 110;
    this.paddleX = (this.canvas.width - this.paddleWidth) / 2;

    this.rightPressed = false;
    this.leftPressed = false;

    this.bricks = [];
    this.brickRowCount = 6;
    this.brickColumnCount = 6;
    this.brickWidth = 75;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 30;

    this.score = 0;
    this.lives = 3;
    this.gameState = '';
    this.timer;

    this.fillScreenWithBricks();
    this.addListeners();
    this.startGame();
}

/**
 * Fills screen with bricks.
 */
Breakout.prototype.fillScreenWithBricks = function() {

    for(var i = 0; i < this.brickColumnCount; i++) {
        this.bricks[i] = [];
        for(var j = 0; j < this.brickRowCount; j++) {
            this.bricks[i][j] = {x: 0, y: 0, status: 1};
        }
    }
};

/**
 * Add listeners.
 */
Breakout.prototype.addListeners = function() {

    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
    document.addEventListener('keyup', this.keyUpHandler.bind(this), false);
    document.addEventListener('mousemove', this.mouseMoveHandler.bind(this), false);
};

/**
 * Clears canvas.
 */
Breakout.prototype.clearCanvas = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * Starts Breakout Game.
 */
Breakout.prototype.startGame = function() {
    this.timer = setInterval(this.draw.bind(this), 10);
};

/**
 * Ends Breakout Game.
 */
Breakout.prototype.endGame = function() {

    clearInterval(this.timer);
    this.clearCanvas();

    if(this.gameState === 'win') {
        this.renderYouWinScreen();
    } else {
        this.renderGameOverScreen();
    }

};

/**
 * Main canvas draw logic of Breakout Game.
 */
Breakout.prototype.draw = function() {

    this.clearCanvas();
    this.drawBricks();
    this.drawBall();
    this.drawPaddle();
    this.drawScore();
    this.drawLives();
    this.collisionDetection();

    if(this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
        this.dx = -this.dx;
    }

    if (this.y + this.dy < this.ballRadius) {

        this.dy = -this.dy;

    } else if (this.y + this.dy > this.canvas.height - this.ballRadius) {

        if(this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {

            this.dy = -this.dy;

        } else {

            this.lives--;

            if(this.lives === 0) {

                this.gameState = 'loose';
                this.endGame();

            } else {

                this.x = this.canvas.width / 2;
                this.y = this.canvas.height -30;
                this.dx = 2;
                this.dy = -2;
                this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
            }
        }
    }

    if(this.rightPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
        this.paddleX += 7;
    } else if(this.leftPressed && this.paddleX > 0) {
        this.paddleX -= 7;
    }

    this.x += this.dx;
    this.y += this.dy;

};

/**
 * Draw Ball.
 */
Breakout.prototype.drawBall = function() {

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI*2);

    this.ctx.fillStyle = '#0095DD';
    this.ctx.strokeStyle = this.randomColor();
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();

};

/**
 * RandomColor generator.
 * @returns {string}
 */
Breakout.prototype.randomColor = function() {
    var letters = 'ABCDE'.split('');
    var color = '#';
    for (var i=0; i<3; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
};

/**
 * Draw Paddle.
 */
Breakout.prototype.drawPaddle = function() {

    this.ctx.beginPath();
    this.ctx.rect(this.paddleX, this.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
    this.ctx.fillStyle = '#ffa45dd';
    this.ctx.fill();
    this.ctx.closePath();
};

/**
 * Draw Bricks.
 */
Breakout.prototype.drawBricks = function() {

    for(var i = 0; i < this.brickColumnCount; i++) {

        for(var j = 0; j < this.brickRowCount; j++) {

            if(this.bricks[i][j].status === 1) {
                var brickX = (i*(this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
                var brickY = (j*(this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
                this.bricks[i][j].x = brickX;
                this.bricks[i][j].y = brickY;
                this.ctx.beginPath();
                this.ctx.rect(brickX,brickY, this.brickWidth, this.brickHeight);
                this.ctx.fillStyle = '#99ff';
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
    }
};

/**
 * Draw Lives.
 */
Breakout.prototype.drawLives = function() {

    this.ctx.font = '18px Arial';
    this.ctx.fillStyle = '#0095dd';
    this.ctx.fillText('Lives: ' + this.lives, this.canvas.width - 65, 20);
};

/**
 * Draw Score.
 */
Breakout.prototype.drawScore = function() {
    this.ctx.font = '17px Arial';
    this.ctx.fillStyle = '#0095dd';
    this.ctx.fillText('Score: ' + this.score, 8, 20);
};

/**
 * Collision Detection logic.
 */
Breakout.prototype.collisionDetection = function() {

    for(var i = 0; i < this.brickColumnCount; i++) {

        for(var j = 0; j < this.brickRowCount; j++) {

            var b = this.bricks[i][j];

            if(b.status === 1) {
                if(this.x > b.x && this.x < (b.x + this.brickWidth) && this.y > b.y && this.y < (b.y + this.brickHeight)) {
                    this.dy = -this.dy;
                    b.status = 0;
                    this.score++;

                    if(this.score === (this.brickRowCount * this.brickColumnCount)) {
                        this.gameState = 'win';
                        this.endGame();
                    }
                }
            }
        }
    }
};

/**
 * Renders Game Over Screen.
 */
Breakout.prototype.renderGameOverScreen = function() {

    let x = (this.canvas.width / 2);
    let y = (this.canvas.height / 2);
    let text = 'GAME OVER!';

    this.ctx.font = '70px Arial';
    this.ctx.textAlign = 'center';

    this.ctx.shadowColor = '#000';
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 7;

    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = '#000';
    this.ctx.strokeText(text, x, y );
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(text, x, y );
};

/**
 * Renders Winning Screen.
 */
Breakout.prototype.renderYouWinScreen = function() {

    let x = (this.canvas.width / 2);
    let y = (this.canvas.height / 2);
    let text = 'YOU WIN!';

    this.ctx.font = '70px Arial';
    this.ctx.textAlign = 'center';

    this.ctx.shadowColor = '#000';
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 7;

    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = '#000';
    this.ctx.strokeText(text, x, y );
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(text, x, y );
};

/**
 * Handler on key down.
 * @param event
 */
Breakout.prototype.keyDownHandler = function(event) {

    if(event.keyCode === 39) {
        this.rightPressed = true;
    } else if(event.keyCode === 37) {
        this.leftPressed = true;
    }
};

/**
 * Handler on key up.
 * @param event
 */
Breakout.prototype.keyUpHandler = function(event) {
    if(event.keyCode === 39) {
        this.rightPressed = false;
    } else if(event.keyCode === 37) {
        this.leftPressed = false;
    }
};

/**
 * Handler on mouse move.
 * @param event
 */
Breakout.prototype.mouseMoveHandler = function(event) {

    event = event || window.event;
    event.preventDefault();
    event.stopPropagation();

    let relativeX = event.clientX - this.offsetX;

    if(relativeX > 0 && relativeX < this.canvas.width) {
        this.paddleX = relativeX - this.paddleWidth / 2;
    }

};

module.exports = Breakout;
},{}]},{},[2]);
