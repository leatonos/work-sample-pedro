import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'


interface LatLong {
  latitute:number,
  longitute:number
}

// Define a type for the slice state
interface FiltersSlice {
  assetNameFilter:string[],
  decadesFilter:number[],
  categoryFilter:string[],
  riskRatingNumber?:number,
  riskRatingComparator?:string,
  riskFactorFilter:string[],
  latLangFilter:LatLong
}

// Define the initial state using that type
const initialState: FiltersSlice = {
  assetNameFilter:[],
  decadesFilter:[],
  categoryFilter:[],
  riskRatingNumber:0,
  riskRatingComparator:'',
  riskFactorFilter:[],
  latLangFilter:{latitute:null,longitute:null}
}

export const filtersSlice = createSlice({
  name: 'filters',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setAssetFilter: (state, action: PayloadAction<string[]>) => {
      state.assetNameFilter = action.payload
    },
    setDecadeFilter: (state, action: PayloadAction<number[]>) => {
      state.decadesFilter = action.payload
    },
    setCategoryFilter: (state, action: PayloadAction<string[]>) => {
      state.categoryFilter = action.payload
    },
    setRatingNumber: (state, action: PayloadAction<number>) => {
      state.riskRatingNumber = action.payload
    },
    setRatingComparator: (state, action: PayloadAction<string>) => {
      state.riskRatingComparator = action.payload
    },
    setRiskFactorFilter: (state, action: PayloadAction<string[]>) => {
      state.riskFactorFilter = action.payload
    },
    setLongLatFilter:(state,action: PayloadAction<LatLong>)=>{
      state.latLangFilter.latitute = action.payload.latitute
      state.latLangFilter.longitute = action.payload.longitute
    },
    clearAllFilters: (state,action: PayloadAction<string>) => {
      state.assetNameFilter = []
      state.decadesFilter = []
      state.categoryFilter = []
      state.riskRatingNumber = 0
      state.riskRatingComparator = ''
      state.riskFactorFilter = []
      state.latLangFilter = {latitute:null,longitute:null}
    },
  },
})

export const { setAssetFilter,setDecadeFilter,setCategoryFilter,
  setRatingNumber, setRatingComparator,setRiskFactorFilter,clearAllFilters,setLongLatFilter } = filtersSlice.actions

export default filtersSlice.reducer