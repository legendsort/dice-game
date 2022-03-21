import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Web3 from 'web3';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
	setMyAddress,
	setMyEther
} from '../main/MainBoardSlice';

const useStyles = makeStyles({
  walletButton: {
    color: 'white',
    backgroundColor: '#9c27b0',
    '&:hover': {
      backgroundColor: '#9c27b0',
    },
  },
})

const MyWallet = () => {
	const classes = useStyles();

	const dispatch = useDispatch()
	const account = useSelector((state: RootState) => state.main.myAddress)
	const eth = useSelector((state: RootState) => state.main.myEther)

	if (typeof window.ethereum === 'undefined') {
	  console.log('MetaMask is not installed!');
	  return
	}

	const web3 = new Web3(Web3.givenProvider)

	const getEth = (account) => {
		web3.eth.getBalance(account, function(err, result) {
		  if (err) {
		    console.log(err)
		  } else {
		    dispatch(setMyEther(web3.utils.fromWei(result, "ether")))
		  }
		})

		setTimeout(() => getEth(account));
	}

	const handleConnectWallet = async () => {
		try {
		  // Request account access
		  await window.ethereum.enable();
		} catch(e) {
		  // User denied access
		  return false
		}
		const accounts = await web3.eth.getAccounts()
		dispatch(setMyAddress(accounts[0]))


		setTimeout(() => getEth(accounts[0]))
  }

	return (
		account ? (
			<Card className={classes.card}>
	      <CardContent>
	        <Typography gutterBottom variant="headline" component="h2">
	          Balance on your Account
	        </Typography>
	        <Typography component="p">
	          {eth && eth} ETH
	        </Typography>
	      </CardContent>
	    </Card>
    ) : (
    	<Button 
    		variant="contained" 
    		color="primary" 
    		className={classes.walletButton}
    		onClick={handleConnectWallet}
    	>
    		Connect to a wallet
    	</Button>
    )
  )
}

export default MyWallet;