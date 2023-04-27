import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Asset,MarkerPoint } from '../interfaces'

// Define a type for the slice state
interface AssetsState {
  assets: Asset[],
  markers:MarkerPoint[]
}

// Define the initial state using that type
const initialState: AssetsState = {
    assets: [],
    markers:[]
}

export const assetsSlice = createSlice({
  name: 'assets',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateFilteredAssets: (state, action: PayloadAction<Asset[]>) => {
      state.assets = action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value

export default assetsSlice.reducer