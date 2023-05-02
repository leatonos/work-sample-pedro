import * as React from 'react'
import { useState } from 'react';
import { Asset } from "../interfaces";
import styles from "../styles/Index.module.css"
import Select, { InputActionMeta } from 'react-select'
import DecadeSelector from './selectors/DecadeSelector';
import RiskSelector from './selectors/RiskSelector';
import Image from 'next/image';
import dynamic from 'next/dynamic'

//Redux Imports
import type { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { updateFilteredAssets } from '../redux/assetsSlice';
import AssetNameSelector from './selectors/AssetNameSelector';
import BusinessCategorySelector from './selectors/BussinessCategorySelector';
import RiskRatingSelector from './selectors/RiskRatingSelector';

import { MarkerPoint } from '../interfaces';

const MapboxMap = dynamic(() => import('../components/Mapbox'),{ ssr: false })

type tableProps = {
    assets: Asset[],
    maxRows: number
  }
const MapContainer = () => {

    const [decades,setDecades] = useState([])
    const dispatch = useDispatch()
    const filteredData = useSelector((state: RootState) => state.assets.assets)
    const [mapPoints,setMapPoints] = useState<MarkerPoint[]>([])
    
    const initialData = useSelector((state: RootState) => state.assets.initialAssets)
    const assetNameFilters = useSelector((state: RootState) => state.filters.assetNameFilter)

    React.useEffect(()=>{

        updatePoints(filteredData)
       
    },[filteredData])

    const updatePoints=(assets: Asset[])=>{
        let markerPoints: MarkerPoint[]=[]
        for(let asset of assets){
    
          const newLocation = [asset.long,asset.lat]
          
          let markerFound = false 
    
          //Checks if this point already exist in the map or not
          for(const marker of markerPoints){
            //if an asset already have a point in the map it adds this asset to this point
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
      setMapPoints(markerPoints)
      }

    return(
        <section className={styles.mapSection} id='map'>
        <div className={styles.mapContainer}>
          <MapboxMap points={mapPoints}/>
        </div>
        <div className={styles.mapControlContainer}>
          <h2>Map control</h2>
          <DecadeSelector propId='mapDecadeSelector'/>
          <div>
          <div className={styles.tableContainer}>
          <table className={styles.tableFixHead}>
            <thead>
              <tr>
                  <th>Latitute</th>
                  <th>Longitude</th>
                  <th>Assets</th>
                  <th>Avg. Risk Rating</th>
              </tr>
            </thead>
            <tbody>
            
            {mapPoints.map((point,index)=>{

             let totalRiskRating = 0

             for(let asset of point.assets){
                totalRiskRating += Number(asset.riskRating)
             }
             const totalOfAssets = point.assets.length
             const avgRiskRating = (totalRiskRating/totalOfAssets).toFixed(3)
              
              return(
                <tr key={index}>
                  <td>{point.coords[1]}</td>
                  <td>{point.coords[0]}</td>
                  <td>{totalOfAssets}</td>
                  <td>{avgRiskRating}</td>
                </tr>
              )
            }
            )}
             
            </tbody>
          </table>
        </div>
          </div>
          <div>
            
          </div>  
        </div>
      </section>
    )

}

export default MapContainer
