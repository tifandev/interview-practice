import {
	OrthographicCamera,
	PerspectiveCamera,
	Loader,
	OrbitControls,
	Outlines,
	Box,
	RoundedBox,
	Stars,
	Text3D,
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const INITIAL_BOARD = Array.from({ length: 20 }, () => Array(10).fill(0))

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

const SPEED = 300

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

	const [muted, setMuted] = useState(false)

	const [startX, setStartX] = useState(0)
	const [startY, setStartY] = useState(0)

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
		function handleTouchStart(e) {
			setStartX(e.touches[0].clientX)
			setStartY(e.touches[0].clientY)
		}

		function handleTouchMove(e) {
			if (!startX || !startY) {
				return
			}

			let xUp = e.touches[0].clientX
			let yUp = e.touches[0].clientY

			let xDiff = startX - xUp
			let yDiff = startY - yUp

			if (Math.abs(xDiff) > Math.abs(yDiff)) {
				if (xDiff > 0) {
					/* left swipe */
					shiftCurrentPieceLeft()
				} else {
					/* right swipe */
					shiftCurrentPieceRight()
				}
			} else {
				if (yDiff > 0) {
					/* up swipe */
					rotateCurrentPieceClockwise()
				} else {
					/* down swipe */
					shiftCurrentPieceDown()
				}
			}

			/* reset values */
			setStartX(null)
			setStartY(null)
		}

		window.addEventListener('touchstart', handleTouchStart)
		window.addEventListener('touchmove', handleTouchMove)

		return () => {
			window.removeEventListener('touchstart', handleTouchStart)
			window.removeEventListener('touchmove', handleTouchMove)
		}
	}, [game])

	useEffect(() => {
		function handleTouchStart(e) {
			musicRef.current.play()
			musicRef.current.volume = 0.25

			setGame((prev) => ({
				...prev,
				status: STATUS.PLAYING,
			}))
		}

		window.addEventListener('touchstart', handleTouchStart)

		return () => {
			window.removeEventListener('touchstart', handleTouchStart)
		}
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
					musicRef.current.volume = 0.25

					setGame((prev) => ({
						...prev,
						status: STATUS.PLAYING,
					}))
					break
				case 'm':
					setMuted((prev) => !prev)
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
			drawShadow(newBoard, newPiece)

			drawNewPiece(newBoard, newPiece)

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

		let hasCollision = checkCollision(game.board, game.currentPiece, game.currentPiece.x, game.currentPiece.y + 1)

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

			const newScore = checkForCompleteRowsAndCalculateScore(newBoard)

			setGame((prev) => ({
				...prev,
				score: prev.score + newScore,
				board: newBoard,
				currentPiece: null,
			}))
		} else {
			drawShadow(newBoard, newPiece)

			/* release upper blocks */
			releaseBlocks(newBoard)

			/* move piece down */
			drawNewPiece(newBoard, newPiece)

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

		let hasCollision = checkCollision(game.board, game.currentPiece, game.currentPiece.x + 1, game.currentPiece.y)

		/* check if next y pos is out of bounds or has collision  */
		if (newPiece.x + newPiece.shape[0].length > newBoard[0].length || hasCollision) {
			return
		} else {
			drawShadow(newBoard, newPiece)

			/* release left side blocks */
			releaseBlocks(newBoard)

			drawNewPiece(newBoard, newPiece)

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

		let hasCollision = checkCollision(game.board, game.currentPiece, game.currentPiece.x - 1, game.currentPiece.y)

		/* check if next y pos is out of bounds or collision  */
		if (newPiece.x < 0 || hasCollision) {
			return
		} else {
			drawShadow(newBoard, newPiece)

			/* release right side blocks */
			releaseBlocks(newBoard)

			drawNewPiece(newBoard, newPiece)

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

		const tempMatrix = game.currentPiece.shape[0].map((col, i) => game.currentPiece.shape.map((row) => row[i]))

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
			drawShadow(newBoard, newPiece)

			releaseBlocks(newBoard)

			drawNewPiece(newBoard, newPiece)

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

	function releaseBlocks(newBoard) {
		for (let y = game.currentPiece.y; y < game.currentPiece.y + game.currentPiece.shape.length; y++) {
			for (let x = game.currentPiece.x; x < game.currentPiece.x + game.currentPiece.shape[0].length; x++) {
				if (newBoard[y][x] !== 2) {
					newBoard[y][x] = 0
				}
			}
		}
	}

	function drawNewPiece(newBoard, newPiece) {
		for (let y = newPiece.y; y < newPiece.y + newPiece.shape.length; y++) {
			for (let x = newPiece.x; x < newPiece.x + newPiece.shape[0].length; x++) {
				if (newBoard[y][x] !== 2) {
					newBoard[y][x] = newPiece.shape[y - newPiece.y][x - newPiece.x]
				}
			}
		}
	}

	function drawShadow(newBoard, newPiece) {
		/* release shadow blocks */
		for (let y = 0; y < newBoard.length; y++) {
			for (let x = 0; x < newBoard[0].length; x++) {
				if (newBoard[y][x] === -1) {
					newBoard[y][x] = 0
				}
			}
		}

		/* draw shadow */
		for (let i = 0; i < newBoard.length; i++) {
			let hasCollision = checkCollision(
				game.board,
				game.currentPiece ? game.currentPiece : newPiece,
				newPiece.x,
				newPiece.y + i
			)

			if (newPiece.y + i + newPiece.shape.length > newBoard.length || hasCollision) {
				i = i - 1

				for (let y = newPiece.y + i; y < newPiece.y + i + newPiece.shape.length; y++) {
					for (let x = newPiece.x; x < newPiece.x + newPiece.shape[0].length; x++) {
						if (newBoard[y][x] !== 2 && newPiece.shape[y - newPiece.y - i][x - newPiece.x] === 1) {
							newBoard[y][x] = -1
						}
					}
				}
				break
			}
		}
	}

	function checkForCompleteRowsAndCalculateScore(newBoard) {
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
		return completedRows * 10 + tetris * 80
	}

	return (
		<div id='container'>
			<audio ref={musicRef} loop src='/music.mp3' muted={muted} />

			<Canvas style={{ height: '100vh', widows: '100%' }} shadows gl={{ alpha: false, antialias: false }}>
				<Suspense fallback={'Loading'}>
					{game.status === STATUS.PLAYING ? (
						<OrthographicCamera makeDefault position={new THREE.Vector3(0, 0, 30)} zoom={24} />
					) : (
						<>
							<PerspectiveCamera makeDefault position={[0, 0, 6]} fov={75} /> <OrbitControls maxDistance={100} />
						</>
					)}

					<color args={['#000']} attach='background' />
					<Stars
						radius={game.status === STATUS.PLAYING ? 10 : 100}
						depth={50}
						count={5000}
						factor={4}
						saturation={0}
						fade
						speed={2}
					/>

					<directionalLight position={[50, 55, 100]} intensity={7} color='#fff' />

					<EffectComposer>
						<Bloom mipmapBlur luminanceThreshold={0.1} luminanceSmoothing={18} strength={1} />
					</EffectComposer>

					<GameHud game={game} muted={muted} />

					<group position={[0, -10.5, -20]}>
						{/* Borders */}
						<group>
							{Array(12)
								.fill(1)
								.map((_, i) =>
									Array(22)
										.fill(1)
										.map((_, j) => {
											if (j === 0 || j === 21 || i === 0 || i === 11) {
												return <Block key={`${i}-${j}`} position={[i - 5.5, -j + 21, 0]} color={'#448'} isVisible />
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
										color={Math.abs(cell) === 1 ? game?.currentPiece?.color : cell === 2 ? '#7f7f7f' : '#7f7f7f'}
										isVisible={cell !== 0}
										isShadow={cell === -1}
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

function Block({ position, color, isVisible, isShadow }) {
	if (isShadow) {
		return (
			<RoundedBox position={position} args={[1, 1, 1]}>
				<meshPhongMaterial wireframe color={color} emissive={color} emissiveIntensity={1} />
			</RoundedBox>
		)
	}

	return isVisible ? (
		<>
			<RoundedBox castShadow receiveShadow radius={0.2} smoothness={0.0001} position={position} args={[1, 1, 1]}>
				<meshPhysicalMaterial
					attach='material'
					color={color}
					metalness={1}
					roughness={0.2}
					clearcoat={0.1}
					clearcoatRoughness={0.5}
				/>
			</RoundedBox>
			{/* <Outlines thickness={0.01} color={color} /> */}
			<RoundedBox position={position} args={[0.95, 0.95, 0.95]}>
				<meshPhongMaterial color={color} emissive={color} emissiveIntensity={1} />
			</RoundedBox>
		</>
	) : null
}

function GameHud({ game, muted }) {
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
								<Text3D position={[-3, 3, -10]} size={1} font='/font.json'>
									{`Game Over`}
									<meshPhongMaterial emissive={'#ff00ff'} emissiveIntensity={9} />
								</Text3D>
							)}
							<Text3D position={[-3, 0, -10]} size={1} font='/font.json'>
								{`Press Enter \n     to Play`}
								<meshPhongMaterial emissive={'#00ffff'} emissiveIntensity={5} />
							</Text3D>
						</>
					)}

					{game.status !== STATUS.STOPPED && (
						<>
							<Text3D
								position={[-19.5, 9.5, 0]}
								size={1.2}
								anchorX='center'
								anchorY='middle'
								rotation={[0, (20 * Math.PI) / 180, 0]}
								font='/font.json'
							>
								{`Score:  ${game.score}`}
								<meshPhongMaterial emissive={'#ffff00'} emissiveIntensity={5} />
							</Text3D>
							<Text3D
								position={[-19.5, -10.5, 0]}
								size={1.2}
								anchorX='center'
								anchorY='middle'
								rotation={[0, (20 * Math.PI) / 180, 0]}
								font='/font.json'
							>
								{`Press M to ${muted ? 'unmute' : 'mute'}`}
								<meshPhongMaterial emissive={'#ffff00'} emissiveIntensity={5} />
							</Text3D>
						</>
					)}
				</group>
			</group>
		</group>
	)
}
