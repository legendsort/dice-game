import { createSlice } from '@reduxjs/toolkit'

const mainSlice = createSlice({
	name: 'main',
	initialState: {
		myAddress: null,		
		myEther: 0,
		myChoice: 0,
		creatorAddress: null,
		joinerAddress: null,
		amount: 0,
		gameState: null,
		recentLogs: []
	},
	reducers: {
		setMyAddress: (state, action) => {
			state.myAddress = action.payload
		},
		setMyEther: (state, action) => {
			state.myEther = action.payload
		},
		setGameState: (state, action) => {
			state.gameState = action.payload
		},
		setCreatorAddress: (state, action) => {
			state.creatorAddress = action.payload
		},
		setJoinerAddress: (state, action) => {
			state.joinerAddress = action.payload
		},
		setAmount: (state, action) => {
			state.amount = action.payload
		},
		setMyChoice: (state, action) => {
			state.myChoice = action.payload
		},
		setRecentLogs: (state, action) => {
			state.recentLogs = action.payload
		},
	}
})

export const { 
	setGameState,
	setCreatorAddress,
	setJoinerAddress,
	setAmount,
	setMyChoice,
	setMyAddress,
	setMyEther,
	setRecentLogs,
} = mainSlice.actions

export default mainSlice.reducer