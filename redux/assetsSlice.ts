import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Asset,MarkerPoint } from '../interfaces'

// Define a type for the slice state
interface AssetsState {
  initialAssets:Asset[],
  assets: Asset[],
  markers:MarkerPoint[]
}

// Define the initial state using that type
const initialState: AssetsState = {
    initialAssets: [],
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
    setInitialData: (state, action: PayloadAction<Asset[]>) => {
      state.initialAssets = action.payload
    },
    setMarkers: (state, action: PayloadAction<Asset[]>) => {
     
      const assets = action.payload
      let markerPoints: MarkerPoint[]=[]
      for(let asset of assets){
  
        const newLocation = [asset.long,asset.lat]
        
        let markerFound = false 
  
        //Checks if this point already exist in the map or not
        for(const marker of markerPoints){
          //if an asset already have a point in the map it adds this asset to that point
          if(marker.coords[0] == newLocation[0] && marker.coords[1] == newLocation[1]){
            marker.assets.push(asset)
            markerFound=true;
          }
        }
  
        //If this point does not exist yet, it adds to the map
        if(!markerFound){
          const newMarkerPoint:MarkerPoint = {
            assets: [asset],
            coords: [asset.long,asset.lat]
          }
          markerPoints.push(newMarkerPoint)
        }
    }
      state.markers = markerPoints
    },
    setGraphData:(state,action: PayloadAction<Asset[]>)=>{
       
    }
  },
})

export const { updateFilteredAssets,setMarkers,setInitialData } = assetsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAssets = (state: RootState) => state.assets.assets

export default assetsSlice.reducer