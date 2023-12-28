/* Game board size: 10x20
 * Shapes: O, I, S, Z, L, J, T
 * User controls: left, right, down and rotation
 */

import { useState, useEffect } from 'react'

const INITIAL_BOARD = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const O_SHAPE = [
	[1, 1],
	[1, 1],
]

const I_SHAPE = [
	[1] /* ************************ */,
	[1] /* ************************ */,
	[1] /* ************************ */,
	[1] /* ************************ */,
]

const S_SHAPE = [
	[0, 1, 1],
	[1, 1, 0],
]

const Z_SHAPE = [
	[1, 1, 0],
	[0, 1, 1],
]

const L_SHAPE = [
	[1, 0],
	[1, 0],
	[1, 1],
]

const J_SHAPE = [
	[0, 1],
	[0, 1],
	[1, 1],
]

const T_SHAPE = [
	[1, 1, 1],
	[0, 1, 0],
]

const SHAPES = [O_SHAPE, I_SHAPE, S_SHAPE, Z_SHAPE, L_SHAPE, J_SHAPE, T_SHAPE]

const COLORS = ['#FFD700', '#00CED1', '#FF4500', '#9400D3', '#32CD32', '#FFA500', '#8B0000']

const SPEED = 500

function getRandomColor() {
	return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export default function Tetris() {
	const [game, setGame] = useState({
		status: 'stopped',
		score: 0,
		currentPiece: null,
		board: INITIAL_BOARD,
	})

	useEffect(() => {
		function updateGame() {
			if (game.status !== 'live') {
				return
			}

			if (!game.currentPiece) {
				spawnPiece()
			} else {
				shiftCurrentPieceDown()
			}
		}

		const interval = setInterval(updateGame, SPEED)

		return () => clearInterval(interval)
	}, [game])

	useEffect(() => {
		function handleKeyDown(e) {
			switch (e.key) {
				case 'ArrowDown':
					shiftCurrentPieceDown()
					break
				case 'ArrowRight':
					shiftCurrentPieceRight()
					break
				case 'ArrowLeft':
					shiftCurrentPieceLeft()
					break
				case 'ArrowUp':
					rotateCurrentPieceClockwise()
					break
				case 'Enter':
					setGame((prev) => ({
						...prev,
						status: 'live',
					}))
					break
				default:
					break
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [game])

	function spawnPiece() {
		console.log('new piece')

		const newBoard = game.board
		const newPiece = {
			x: 4,
			y: 0,
			shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
			color: getRandomColor(),
		}

		let hasCollision = checkCollision(game.board, newPiece, newPiece.x, newPiece.y)

		if (hasCollision) {
			/* game lost, resetting */
			setGame({
				status: 'lost',
				score: 0,
				currentPiece: null,
				board: INITIAL_BOARD.map((y) => y.map(() => 0)),
			})
		} else {
			for (let y = newPiece.y; y < newPiece.shape.length; y++) {
				for (let x = newPiece.x; x < newPiece.shape[0].length + newPiece.x; x++) {
					newBoard[y][x] = newPiece.shape[y][x - newPiece.x]
				}
			}

			setGame((prev) => ({ ...prev, board: newBoard, currentPiece: newPiece }))
		}
	}

	function shiftCurrentPieceDown() {
		if (!game.currentPiece) {
			return
		}

		console.log('shifting piece ↓')

		const newBoard = game.board
		const newPiece = { ...game.currentPiece, y: game.currentPiece.y + 1 }

		let hasCollision = checkCollision(
			game.board,
			game.currentPiece,
			game.currentPiece.x,
			game.currentPiece.y + 1
		)

		/* check if next y pos is out of bounds or has collision  */
		if (newPiece.y + newPiece.shape.length > newBoard.length || hasCollision) {
			newPiece.y = newPiece.y - 1

			for (let y = newPiece.y; y < newPiece.y + newPiece.shape.length; y++) {
				for (let x = newPiece.x; x < newPiece.x + newPiece.shape[0].length; x++) {
					if (newPiece.shape[y - newPiece.y][x - newPiece.x] === 1) {
						newBoard[y][x] = 2
					}
				}
			}

			/* Delete complete rows and add score */
			let completedRows = 0
			let tetrisCount = 0
			let tetris = 0

			for (let y = 0; y < newBoard.length; y++) {
				let completedCells = 0

				for (let x = 0; x < newBoard[y].length; x++) {
					if (newBoard[y][x]) {
						completedCells++
					}
				}

				if (completedCells === 10) {
					completedRows++
					tetrisCount++
					newBoard.splice(y, 1)
					newBoard.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

					if (tetrisCount === 4) {
						completedRows = completedRows - 4
						tetris++
						tetrisCount = 0
					}
				} else {
					tetrisCount = 0
				}
			}

			/* individual rows award 10 points and a tetris awards 80 points */

			setGame((prev) => ({
				...prev,
				score: prev.score + completedRows * 10 + tetris * 80,
				board: newBoard,
				currentPiece: null,
			}))
		} else {
			/* release upper blocks */
			for (let y = newPiece.y - 1; y < newPiece.y; y++) {
				for (let x = newPiece.x; x < newPiece.shape[0].length + newPiece.x; x++) {
					if (newBoard[y][x] !== 2) {
						newBoard[y][x] = 0
					}
				}
			}

			for (let y = newPiece.y; y < newPiece.y + newPiece.shape.length; y++) {
				for (let x = newPiece.x; x < newPiece.x + newPiece.shape[0].length; x++) {
					if (newBoard[y][x] !== 2) {
						newBoard[y][x] = newPiece.shape[y - newPiece.y][x - newPiece.x]
					}
				}
			}

			setGame((prev) => ({
				...prev,
				board: newBoard,
				currentPiece: newPiece,
			}))
		}
	}

	function shiftCurrentPieceRight() {
		if (!game.currentPiece) {
			return
		}

		console.log('shifting piece ->')

		const newBoard = game.board
		const newPiece = { ...game.currentPiece, x: game.currentPiece.x + 1 }

		let hasCollision = checkCollision(
			game.board,
			game.currentPiece,
			game.currentPiece.x + 1,
			game.currentPiece.y
		)

		/* check if next y pos is out of bounds or has collision  */
		if (newPiece.x + newPiece.shape[0].length > newBoard[0].length || hasCollision) {
			return
		} else {
			/* release left side blocks */
			for (let y = newPiece.y; y < newPiece.y + newPiece.shape.length; y++) {
				if (newBoard[y][newPiece.x - 1] !== 2) {
					newBoard[y][newPiece.x - 1] = 0
				}
			}

			for (let y = newPiece.y; y < newPiece.y + newPiece.shape.length; y++) {
				for (let x = newPiece.x; x < newPiece.x + newPiece.shape[0].length; x++) {
					if (newBoard[y][x] !== 2) {
						newBoard[y][x] = newPiece.shape[y - newPiece.y][x - newPiece.x]
					}
				}
			}

			setGame((prev) => ({
				...prev,
				board: newBoard,
				currentPiece: newPiece,
			}))
		}
	}

	function shiftCurrentPieceLeft() {
		if (!game.currentPiece) {
			return
		}

		console.log('shifting piece <-')

		const newBoard = game.board
		const newPiece = { ...game.currentPiece, x: game.currentPiece.x - 1 }

		let hasCollision = checkCollision(
			game.board,
			game.currentPiece,
			game.currentPiece.x - 1,
			game.currentPiece.y
		)

		/* check if next y pos is out of bounds or collision  */
		if (newPiece.x < 0 || hasCollision) {
			return
		} else {
			/* release right side blocks */
			for (let y = newPiece.y; y < newPiece.y + newPiece.shape.length; y++) {
				if (newBoard[y][newPiece.x + newPiece.shape[0].length] !== 2) {
					newBoard[y][newPiece.x + newPiece.shape[0].length] = 0
				}
			}

			for (let y = newPiece.y; y < newPiece.y + newPiece.shape.length; y++) {
				for (let x = newPiece.x; x < newPiece.x + newPiece.shape[0].length; x++) {
					if (newBoard[y][x] !== 2) {
						newBoard[y][x] = newPiece.shape[y - newPiece.y][x - newPiece.x]
					}
				}
			}

			setGame((prev) => ({
				...prev,
				board: newBoard,
				currentPiece: newPiece,
			}))
		}
	}

	function rotateCurrentPieceClockwise() {
		if (!game.currentPiece) {
			return
		}

		console.log('rotating piece')

		const tempMatrix = game.currentPiece.shape[0].map((col, i) =>
			game.currentPiece.shape.map((row) => row[i])
		)

		const rotatedPiece = tempMatrix.map((row) => row.reverse())

		const newBoard = game.board
		const newPiece = { ...game.currentPiece, shape: rotatedPiece }

		let hasCollision = checkCollision(game.board, newPiece, newPiece.x, newPiece.y)

		/* check if out of bounds or collision  */
		if (
			newPiece.y + newPiece.shape.length > newBoard.length ||
			newPiece.x < 0 ||
			newPiece.x + newPiece.shape[0].length > newBoard[0].length ||
			hasCollision
		) {
			return
		} else {
			/* release unrotated blocks */
			for (
				let y = game.currentPiece.y;
				y < game.currentPiece.y + game.currentPiece.shape.length;
				y++
			) {
				for (
					let x = game.currentPiece.x;
					x < game.currentPiece.x + game.currentPiece.shape[0].length;
					x++
				) {
					if (newBoard[y][x] !== 2) {
						newBoard[y][x] = 0
					}
				}
			}

			for (let y = newPiece.y; y < newPiece.y + newPiece.shape.length; y++) {
				for (let x = newPiece.x; x < newPiece.x + newPiece.shape[0].length; x++) {
					if (newBoard[y][x] !== 2) {
						newBoard[y][x] = newPiece.shape[y - newPiece.y][x - newPiece.x]
					}
				}
			}

			setGame((prev) => ({
				...prev,
				board: newBoard,
				currentPiece: newPiece,
			}))
		}
	}

	function checkCollision(board, piece, posX, posY) {
		for (let y = 0; y < piece.shape.length; y++) {
			for (let x = 0; x < piece.shape[y].length; x++) {
				if (piece.shape[y][x] === 1 && (board[posY + y] && board[posY + y][posX + x]) === 2) {
					return true
				}
			}
		}

		return false
	}

	return (
		<div
			id='container'
			style={{
				height: '100vh',
				display: 'grid',
				alignContent: 'center',
				justifyContent: 'center',
			}}
		>
			{game.status !== 'live' ? (
				<div style={{ textAlign: 'center' }}>
					{game.status === 'lost' && <p style={{ color: 'red' }}>You lost</p>}
					<p>Press enter to play</p>
				</div>
			) : (
				<div>
					<p>Score: {game.score}</p>
					<div
						id='board'
						style={{
							height: '600px',
							width: '300px',
							border: 'gray solid 1px',
						}}
					>
						{game.board.map((row, rowIndex) => (
							<div
								id={'row-' + rowIndex}
								key={'row-' + rowIndex}
								style={{ display: 'flex', height: '30px', width: '100%' }}
							>
								{row.map((cell, cellIndex) => (
									<div
										id={'cell-' + cellIndex}
										key={'cell-' + cellIndex}
										style={{
											height: '30px',
											width: '30px',
											backgroundColor:
												cell === 1
													? game?.currentPiece?.color
													: cell === 2
													? 'darkslategray'
													: 'white',
											outline: 'gray solid 0.5px',
											textAlign: 'center',
										}}
									>
										{/* {cell} */}
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			)}

			{/* <div>
				<div>{JSON.stringify(game)}</div>
			</div> */}
		</div>
	)
}
