const Player = function (name, marker) {
	return { name, marker }
}

const Gameboard = (function () {
	let gameboard = ["", "", "", "", "", "", "", "", ""]

	const getGameboard = () => gameboard

	const setGameboard = (index, marker) => {
		gameboard[index] = marker
	}

	const resetGameboard = () => {
		gameboard = ["", "", "", "", "", "", "", "", ""]
	}

	return {
		getGameboard,
		setGameboard,
		resetGameboard,
	}
})()

const Game = (function () {
	let player1
	let player2
	let currentPlayer
	let gameOver = false

	const startGame = () => {
		const player1Name = document.getElementById("player1").value
		const player2Name = document.getElementById("player2").value
		player1 = Player(player1Name, "X")
		player2 = Player(player2Name, "O")
		currentPlayer = player1
		gameOver = false
		Gameboard.resetGameboard()
	}

	const getCurrentPlayer = () => currentPlayer

	const changeCurrentPlayer = () => {
		currentPlayer = currentPlayer === player1 ? player2 : player1
	}

	const getGameOver = () => gameOver

	const setGameOver = () => {
		gameOver = true
	}

	return {
		startGame,
		getCurrentPlayer,
		changeCurrentPlayer,
		getGameOver,
		setGameOver,
	}
})()

const DisplayController = (function () {
	const cells = document.querySelectorAll(".cell")
	const message = document.querySelector(".message")
	const messageWrapper = document.querySelector(".message-wrapper")
	const restartButton = document.querySelector("#reset")
	const form = document.querySelector(".form-wrapper")
	const body = document.querySelector("body")
	const turn = document.querySelector(".turn")
	const switchNames = document.querySelector(".switch")
	const startButton = document.getElementById("start")

	const render = () => {
		const board = Gameboard.getGameboard()
		for (let i = 0; i < board.length; i++) {
			cells[i].textContent = board[i]
		}
	}

	const addClickEvent = () => {
		for (let i = 0; i < cells.length; i++) {
			cells[i].addEventListener("click", () => {
				if (Game.getGameOver()) return
				if (cells[i].textContent !== "") return
				Gameboard.setGameboard(i, Game.getCurrentPlayer().marker)
				render()
				checkWinner()
				Game.changeCurrentPlayer()
				if (!Game.getGameOver()) {
					turn.textContent = `${Game.getCurrentPlayer().name}'s turn (${
						Game.getCurrentPlayer().marker
					})`
				}
			})
		}
		switchNames.addEventListener("click", () => {
			const player1 = document.getElementById("player1")
			const player2 = document.getElementById("player2")
			const temp = player1.value
			player1.value = player2.value
			player2.value = temp
		})
		startButton.addEventListener("click", () => {
			Game.startGame()
			message.textContent = ""
			render()
			form.style.display = "none"
			body.style.flexDirection = "column"
			body.style.gap = "0"
			messageWrapper.style.display = "none"
			turn.style.display = "block"
			turn.textContent = `${Game.getCurrentPlayer().name}'s turn (${
				Game.getCurrentPlayer().marker
			})`
		})
	}

	const checkWinner = () => {
		const board = Gameboard.getGameboard()
		const winningCombos = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		]

		for (let i = 0; i < winningCombos.length; i++) {
			const [a, b, c] = winningCombos[i]
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				messageWrapper.style.display = "block"
				message.textContent = `${Game.getCurrentPlayer().name} wins!`
				turn.textContent = "Game Over!"
				Game.setGameOver()
			} else if (board.every((cell) => cell !== "")) {
				messageWrapper.style.display = "block"
				message.textContent = "It's a tie!"
				turn.textContent = "Game Over!"
				Game.setGameOver()
			}
		}
	}

	const addRestartEvent = () => {
		restartButton.addEventListener("click", () => {
			Gameboard.resetGameboard()
			turn.style.display = "none"
			message.textContent = ""
			render()
			form.style.display = "flex"
			body.style.flexDirection = "row"
			body.style.gap = "100px"
			messageWrapper.style.display = "none"
		})
	}

	return {
		render,
		addClickEvent,
		addRestartEvent,
	}
})()

DisplayController.addClickEvent()
DisplayController.addRestartEvent()
