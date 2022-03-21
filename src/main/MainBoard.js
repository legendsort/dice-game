import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DiceBoard from '../components/DiceBoard';
import { Input, InputAdornment, Button, Select, MenuItem, CircularProgress } from '@material-ui/core';
import Swal from 'sweetalert2';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
	setGameState,
	setCreatorAddress,
	setJoinerAddress,
	setAmount,
	setMyChoice
} from './MainBoardSlice';

import web3 from '../core/web3';
import game from '../core/gameInstance';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
    alignItems: 'center',
		backgroundColor: '#4d6087',
		height: '100vh'
		// marginTop: theme.spacing(8),
	},
	footer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContents: 'center',
    alignItems: 'center',
	},
	input: {
		color: 'white',
		margin: 30
	},
	select: {
		color: 'white',
		width: 100,
		margin: 30
	},
	inputPanel: {
		display: 'flex',
		justifyContent: 'space-evenly',
		width: '50vw'
	},
	button: {
		width: 200
	}
})

const MainBoard = () => {
	const classes = useStyles();
  const dispatch = useDispatch()

	const gameState = useSelector((state: RootState) => state.main.gameState)
	const amount = useSelector((state: RootState) => state.main.amount)
	const myChoice = useSelector((state: RootState) => state.main.myChoice)
	const myAddress = useSelector((state: RootState) => state.main.myAddress)
	const myEther = useSelector((state: RootState) => state.main.myEther)

	const [dice1, setDice1] = useState(1)
	const [dice2, setDice2] = useState(1)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			const gameState = await game.methods.isGameCreated().call()
			const creatorAddress = await game.methods.player1().call()
			const joinerAddress = await game.methods.player2().call()
			const betAmount = await game.methods.betAmount().call()
			const betAmountInEth = web3.utils.fromWei(betAmount, "ether");
			const p1Choice = await game.methods.p1Choice().call()

			dispatch(setGameState(gameState))
			dispatch(setCreatorAddress(creatorAddress))
			dispatch(setJoinerAddress(joinerAddress))
			dispatch(setAmount(betAmountInEth))
			dispatch(setMyChoice(1 - p1Choice))

			await game.events.gameCreated().on('data', (event) => {
				dispatch(setGameState(true))
				dispatch(setCreatorAddress(event.returnValues[0]))
				dispatch(setJoinerAddress(''))
				dispatch(setAmount(web3.utils.fromWei(event.returnValues[1], "ether")))
				dispatch(setMyChoice(1 - event.returnValues[2]))
				setIsLoading(false)
			})
			await game.events.gameFinished().on('data', (event) => {
				dispatch(setGameState(false))
				dispatch(setJoinerAddress(event.returnValues[0]))
				dispatch(setAmount(0))
				dispatch(setMyChoice(0))
				setDice1(event.returnValues[1])
				setDice2(event.returnValues[2])
				setIsLoading(false)
			})
		}
		fetchData()
	}, [gameState])

	const handleChange = (event) => {
		dispatch(setAmount(event.target.value))
	}

	const handleSelect = (event) => {
		dispatch(setMyChoice(event.target.value))
	}

	const handleCreate = async () => {
		if (amount == 0) {
      Swal.fire('Please bet on the Game !!!')
			return
		}
		if (amount >= myEther) {
			Swal.fire('Eth is not enough.\nPlease check your wallet !!!')
		} else {
			setIsLoading(true)
			const amountToSend = web3.utils.toWei(amount, "ether");
			await game.methods.createGame(myChoice).send({
				from: myAddress,
				value: amountToSend,
			})
		}
	}

	const handleJoin = async () => {
		const betAmount = await game.methods.betAmount().call()
		const betAmountInEth = web3.utils.fromWei(betAmount, "ether");
		if (betAmountInEth > myEther) {
			Swal.fire('Eth is not enough.\nPlease check your wallet !!!')
		} else {
			setIsLoading(true)
			await game.methods.joinGame().send({
				from: myAddress,
				value: betAmount,
			})
		}
	}

	return (
		<div className={classes.root}>
			<DiceBoard 
				gameState={gameState}
				dice1={dice1}
				dice2={dice2}
			/>
			<div className={classes.footer}>
        <div className={classes.inputPanel}>
					<Input
	          className={classes.input}
	          value={amount}
	          placeholder="0"
	          disabled={gameState}
	          onChange={handleChange}
	          endAdornment={
	          	<InputAdornment position="end">
	          		<span style={{color: 'white'}}>Eth</span>
	        		</InputAdornment>
	          }
	        />
	        <Select 
	        	className={classes.select} 
	          disabled={gameState}
	        	value={myChoice}
	        	onChange={handleSelect}
	        >
				    <MenuItem value={0}>Even</MenuItem>
				    <MenuItem value={1}>Odd</MenuItem>
				  </Select>
			  </div>
			  {!gameState ?
					<Button 
						variant="contained" 
						color="secondary" 
						className={classes.button}
						onClick={handleCreate}
					>
						{!isLoading ?
			        "Create Game"
		        :
			        <CircularProgress color="inherit"/>
						}
		      </Button>
	      :
					<Button 
						variant="contained" 
						color="primary" 
						className={classes.button}
						onClick={handleJoin}
					>
						{!isLoading ?
			        "Join Game"
		        :
			        <CircularProgress color="inherit" />
						}
		      </Button>
		    }
			</div>
		</div>
	);
}

export default MainBoard;