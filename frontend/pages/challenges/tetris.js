import { Loader, OrbitControls, Outlines, RoundedBox, Stars, Text3D } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Suspense, useEffect, useRef, useState } from 'react'

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

const SHAPES = [I_SHAPE, J_SHAPE, L_SHAPE, O_SHAPE, S_SHAPE, T_SHAPE, Z_SHAPE]

const COLORS = ['#00ffff', '#0000ff', '#ff7f00', '#ffff00', '#00ff00', '#800080', '#ff0000']

const SPEED = 400

const STATUS = {
	PLAYING: 'playing',
	STOPPED: 'stopped',
	GAMEOVER: 'game-over',
}

export default function Tetris() {
	const [game, setGame] = useState({
		status: STATUS.STOPPED,
		score: 0,
		currentPiece: null,
		board: INITIAL_BOARD,
	})

	const musicRef = useRef()

	useEffect(() => {
		function updateGame() {
			if (game.status !== STATUS.PLAYING) {
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
					musicRef.current.play()

					setGame((prev) => ({
						...prev,
						status: STATUS.PLAYING,
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

		const randomIndex = Math.floor(Math.random() * SHAPES.length)

		const newBoard = game.board
		const newPiece = {
			x: 4,
			y: 0,
			shape: SHAPES[randomIndex],
			color: COLORS[randomIndex],
		}

		let hasCollision = checkCollision(game.board, newPiece, newPiece.x, newPiece.y)

		if (hasCollision) {
			/* game lost, resetting */
			musicRef.current.pause()
			musicRef.current.currentTime = 0

			setGame({
				status: STATUS.GAMEOVER,
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
		<div id='container'>
			<audio ref={musicRef} autoPlay loop src='/music.mp3' />

			<Canvas
				style={{ height: '100vh', widows: '100%' }}
				shadows
				camera={{
					position: [0, 0, 2],
					fov: 60,
				}}
				gl={{ alpha: false, antialias: false }}
			>
				<Suspense fallback={'Loading'}>
					<OrbitControls
						enableZoom={false}
						maxPolarAngle={2}
						minPolarAngle={1}
						maxAzimuthAngle={Math.PI / 4}
						minAzimuthAngle={-Math.PI / 4}
					/>

					{/* <OrthographicCamera makeDefault position={new THREE.Vector3(0, 0, 30)} zoom={30} /> */}
					<color args={['#000']} attach='background' />
					<Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />

					<directionalLight position={[50, 30, 100]} intensity={6} color='#fff' />

					<EffectComposer>
						<Bloom mipmapBlur luminanceThreshold={0.3} luminanceSmoothing={18} strength={0.1} />
					</EffectComposer>

					<GameHud game={game} />

					<group position={[0, -10.5, -18]}>
						{/* Borders */}
						<group>
							{Array(12)
								.fill(1)
								.map((_, i) =>
									Array(22)
										.fill(1)
										.map((_, j) => {
											if (j === 0 || j === 21 || i === 0 || i === 11) {
												return (
													<Block
														key={`${i}-${j}`}
														position={[i - 5.5, -j + 21, 0]}
														color={'#448'}
														isVisible
													/>
												)
											}
										})
								)}
						</group>

						{/* Blocks */}
						<group>
							{game.board.map((row, rowIndex) =>
								row.map((cell, cellIndex) => (
									<Block
										key={`${rowIndex}-${cellIndex}`}
										position={[cellIndex - 4.5, -rowIndex + 20, 0]}
										color={
											cell === 1 ? game?.currentPiece?.color : cell === 2 ? '#7f7f7f' : '#7f7f7f'
										}
										isVisible={cell !== 0}
									/>
								))
							)}
						</group>
					</group>
				</Suspense>
			</Canvas>
			<Loader />
		</div>
	)
}

function Block({ position, color, isVisible }) {
	return isVisible ? (
		<RoundedBox
			castShadow
			receiveShadow
			radius={0.2}
			smoothness={0.0001}
			position={position}
			args={[1, 1, 1]}
		>
			<meshPhysicalMaterial
				attach='material'
				color={color}
				metalness={1}
				roughness={0.2}
				clearcoat={0.1}
				clearcoatRoughness={0.5}
			/>

			<Outlines thickness={0.01} color={color} />
		</RoundedBox>
	) : null
}

function GameHud({ game }) {
	const position = [0, 0, -2]
	const { camera } = useThree()

	const [props, setProps] = useState({
		position: position,
		rotation: [0, 0, 0],
	})

	useEffect(() => {
		if (game.status === STATUS.PLAYING) {
			camera.position.set(0, 0, 2)
		}
	}, [game.status])

	useFrame(() => {
		const { x, y, z } = camera.position
		const { x: rotX, y: rotY, z: rotZ } = camera.rotation
		setProps({ position: [x, y, z], rotation: [rotX, rotY, rotZ] })
	})

	return (
		<group position={props.position}>
			<group rotation={props.rotation}>
				<group position={position}>
					{game.status !== STATUS.PLAYING && (
						<>
							{game.status === STATUS.GAMEOVER && (
								<Text3D position={[-1.8, 1, -5]} size={0.6} font='/font.json'>
									{`Game Over`}
									<meshPhongMaterial emissive={'#ff00ff'} emissiveIntensity={8} />
								</Text3D>
							)}
							<Text3D position={[-1.5, 0, -5]} size={0.5} font='/font.json'>
								{`Press Enter \n     to Play`}
								<meshPhongMaterial emissive={'#00ffff'} emissiveIntensity={4} />
							</Text3D>
						</>
					)}

					{game.status !== STATUS.STOPPED && (
						<Text3D
							anchorX='center'
							anchorY='middle'
							rotation={[0, (20 * Math.PI) / 180, 0]}
							position={[-6, 2.5, -5]}
							size={0.5}
							font='/font.json'
						>
							{`Score ${game.score}`}
							<meshPhongMaterial emissive={'#ffff00'} emissiveIntensity={4} />
						</Text3D>
					)}
				</group>
			</group>
		</group>
	)
}
