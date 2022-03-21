import { configureStore } from '@reduxjs/toolkit'
import mainReducer from '../main/MainBoardSlice'

export const store = configureStore({
	reducer: {
		main: mainReducer
	}
})

export type RootState = ReturnType<typeof store.getState>