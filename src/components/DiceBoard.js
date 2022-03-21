import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputAdornment } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setRecentLogs } from '../main/MainBoardSlice';

import web3 from '../core/web3';
import game from '../core/gameInstance';
import MyWallet from './MyWallet';
import '../css/Dice.css'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		justifyContent: 'space-evenly',
		width: '100vw',
		height: '75%'
	},
	stateBoard: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		width: '25%'
	},
	details: {
		alignItems: 'center',
		justifyContent: 'space-evenly',
		width: '25%',
		height: '50%',
		margin: '50px 0'
	},
	playground: {
		width: 450,
		margin: 30
	},
	gridList: {
		outline: 'solid 5px'
	},
	cell: {
		outline: 'solid'
	},
	card: {
    width: 345,
  },
  history: {
  	width: 450,
  	maxHeight: '55vh',
  	overflow: 'auto'
  },
  cup: {
  	position: 'absolute',
  	top: '-50vh',
  	left: '50%',
  	transform: 'translate(-50%, 0)'
  }
})

const Dice = (props) => {
	const url = '/dice/' + props.value + '.PNG'
	return (
		<div>
			{props.first ?
				<img 
					src={url}
					style={{
						width: 50,
					  border: '2px solid black',
					  borderRadius: 5,
					  position: 'relative',
					  top: 75,
					  left: -30
					}}
					alt="dice"
			  />
			:
				<img 
					src={url}
					style={{
						width: 50,
					  border: '2px solid black',
					  borderRadius: 5,
					  position: 'relative',
					  top: 25,
					  left: 30
					}}
					alt="dice"
			  />
			}
		</div>
	)
}

const DiceBoard = ({ gameState, dice1, dice2 }) => {
	const classes = useStyles();
  const dispatch = useDispatch()

	const creatorAddress = useSelector((state: RootState) => state.main.creatorAddress)
	const joinerAddress = useSelector((state: RootState) => state.main.joinerAddress)

	useEffect(() => {
		let id = 0;
		const createData = (winner, loser, amount) => {
		  id += 1;
		  return { id, winner, loser, amount };
		}

		const shortenAddress = (address) => {
			return address.substring(0, 7) + "..." + address.substring(address.length - 5)
		}

		const fetchData = async () => {
		  let rows = []
			for (var i = 0; i < 10; i++) {
				const recentLog = await game.methods.recentLogs(i).call()
				const winner = shortenAddress(recentLog.winner)
				const loser = shortenAddress(recentLog.loser)
				const amount = web3.utils.fromWei(recentLog.amount, "ether");
				rows.push(createData(winner, loser, amount))
			}
			dispatch(setRecentLogs(rows))
		}
		fetchData()
	}, [gameState])

	const recentLogs = useSelector((state: RootState) => state.main.recentLogs)

	return (
		<div className={classes.root}>
			<div className={classes.stateBoard}>
				<MyWallet />
				<div style={{color: '#42cddb', fontSize: '20pt'}}>
					{!gameState ?
						<span>
							Game is ready !<br/><br/>Please bet and create !
						</span>
					:
						<span>
							Someone has created !<br/><br/>Please join now !
						</span>
					}
				</div>
			</div>
			<div className={classes.playground}>
				<div 
					style={{
						height: '20vh',
					}}
			  />
				<Dice value={dice1} first/>
				<Dice value={dice2} second/>
				<img 
					src='/dice/table.png'
					style={{
						width: '100%',
					}}
					alt="dice"
			  />
				<img 
					src='/dice/cup.png'
					className={classes.cup}
					alt="cup"
			   />
			</div>
			<div className={classes.details}>
				<div style={{color: '#42cddb', fontSize: '20pt'}}>
					{!gameState ?
						"Last Play"
					:
						"Current State"
					}
				</div>
				<TextField
	        label="Creator Address:"
	        style={{width: '450px'}}
	        disabled
	        value={creatorAddress}
	        InputProps={{
	          startAdornment: (
	            <InputAdornment position="start">
	              <AccountCircle />
	            </InputAdornment>
	          ),
	        }}
	      />
				<TextField
	        label="Joiner Address:"
	        style={{width: '450px'}}
	        disabled
	        value={joinerAddress}
	        InputProps={{
	          startAdornment: (
	            <InputAdornment position="start">
	              <AccountCircle />
	            </InputAdornment>
	          ),
	        }}
	      />
				<div style={{marginTop: 50, color: '#42cddb', fontSize: '20pt'}}>
					Game History
				</div>
				<div className={classes.history}>
	        <Table className={classes.table}>
		        <TableHead>
		          <TableRow>
		            <TableCell align="center">Winner</TableCell>
		            <TableCell align="center">Loser</TableCell>
		            <TableCell align="right">Amount</TableCell>
		          </TableRow>
		        </TableHead>
		        <TableBody>
		          {recentLogs.map(row => {
		          	if (row.amount === '0') return
		          	return (
			            <TableRow key={row.id}>
			              <TableCell component="th" scope="row">
			                {row.winner}
			              </TableCell>
			              <TableCell align="right">{row.loser}</TableCell>
			              <TableCell align="right">{row.amount} Eth</TableCell>
			            </TableRow>
			          )
			        })}
		        </TableBody>
		      </Table>
				</div>
			</div>
		</div>
	);
}

export default DiceBoard;