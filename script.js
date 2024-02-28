// Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let canvasWidth = 750;
let canvasHeight = 250;

// Dino
let dinoImg;
const dinoWidth = 60;
const dinoHeight = 65;
let dinoY = canvasHeight - dinoHeight;

const dino = {
	x: 25,
	y: dinoY,
	width: dinoWidth,
	height: dinoHeight,
};

// Cactuses
let cactusArr = [];
let cactus1Width = 30;
let cactus2Width = 65;
let cactus3Width = 95;
const cactusHeight = 70;

let cactusX = canvasWidth - cactus1Width;
let cactusY = canvasHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// Replay image
let replayImgWidth = 50;
let replayImgHeight = 50;

// Physics
let velocityX = -8;
let velocityY = 0;
let gravity = 0.5;

// Gameboard
let score = 0;
let highScore = 0;
let gameOver = false;
const gameOverText = 'GAME OVER';

// Applied it in collision function to be more pixel realistic the collision
let collisionDistance = 10;

window.onload = function () {
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	// Drawing dino
	dinoImg = new Image();
	dinoImg.src = './img/dino.png';
	dinoImg.onload = function () {
		ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
	};

	// Drawing cactuses
	cactus1Img = new Image();
	cactus1Img.src = './img/cactus1.png';

	cactus2Img = new Image();
	cactus2Img.src = './img/cactus2.png';

	cactus3Img = new Image();
	cactus3Img.src = './img/cactus3.png';

	update();
	setInterval(drawCactus, 1000);

	document.addEventListener('keydown', moveDino);
};

function update() {
	let animationFrame = requestAnimationFrame(update);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	// Functionality for dino gravity(used in moveDino function)
	velocityY += gravity;
	dino.y = Math.min(dino.y + velocityY, dinoY);

	ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

	for (let i = 0; i < cactusArr.length; i++) {
		let cactus = cactusArr[i];
		cactus.x += velocityX;
		ctx.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

		// Checking if there is collision
		if (collision(dino, cactus)) {
			cancelAnimationFrame(animationFrame);
			dinoImg.src = './img/dino-dead.png';
			if (score > highScore) highScore = score + 1;
			gameOver = true;

			// Drawing 'Game Over' text on canvas
			ctx.textAlign = 'center';
			ctx.font = '30px courier';
			ctx.fillText(gameOverText, canvasWidth / 2, canvasHeight / 2);
			ctx.textAlign = 'start';

			// Drawing Replay img on canvas
			let replayImg = new Image();
			replayImg.src = './img/replay.png';
			replayImg.onload = function () {
				ctx.drawImage(
					replayImg,
					canvas.width / 2 - replayImgWidth / 2,
					canvas.height / 2 + replayImgHeight / 2,
					replayImgWidth,
					replayImgHeight
				);
			};
		}
	}

	score++;
	ctx.font = '25px courier';
	ctx.fillText(score, 20, 40);
	ctx.font = '20px courier';
	ctx.fillText(`Highest score:${highScore}`, 20, 60);
}

function drawCactus() {
	let cactus = {
		img: null,
		x: cactusX,
		y: cactusY,
		width: null,
		height: cactusHeight,
	};

	const randomCactusPosition = Math.random();

	if (randomCactusPosition > 0.8) {
		cactus.img = cactus3Img;
		cactus.width = cactus3Width;
		cactusArr.push(cactus);
	} else if (randomCactusPosition > 0.6) {
		cactus.img = cactus2Img;
		cactus.width = cactus2Width;
		cactusArr.push(cactus);
	} else if (randomCactusPosition > 0.3) {
		cactus.img = cactus1Img;
		cactus.width = cactus1Width;
		cactusArr.push(cactus);
	}

	// Remove last cactus, for possible performance issues.
	if (cactusArr.length > 5) cactusArr.shift();
}

function moveDino(e) {
	if ((e.code === 'Space' || e.key === 'ArrowUp') && dino.y === dinoY)
		velocityY = -11;

	if (e.key === 'ArrowDown' && dino.y !== dinoY) {
		velocityY = 0;
		dino.y = dinoY;
	}
}

canvas.addEventListener('click', () => (velocityY = -11));

function collision(d, c) {
	return (
		// Checks if the LEFT edge of dino is to the LEFT of the RIGHT edge of cactus
		d.x < c.x + c.width - collisionDistance &&
		// Checks if the RIGHT edge of dino is to the RIGHT of the LEFT edge of cactus
		d.x + d.width - collisionDistance > c.x &&
		// Checks if the TOP edge of dino is above the BOTTOM edge of cactus
		d.y < c.y + c.height - collisionDistance &&
		// Checks if the BOTTOM edge of dino is below the TOP edge of cactus
		d.y + d.height - collisionDistance > c.y
	);
}

function reset() {
	if (gameOver) {
		score = 0;
		cactusArr = [];
		update();
		dinoImg.src = './img/dino.png';
		gameOver = false;
	}
}

canvas.addEventListener('click', reset);
document.addEventListener('keypress', (e) => e.code === 'Space' && reset());
