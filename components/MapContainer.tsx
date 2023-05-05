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
import { clearAllFilters } from '../redux/filtersSlice';

//Types
import { MarkerPoint } from '../interfaces';

//Mapbox component Import
const MapboxMap = dynamic(() => import('../components/Mapbox'),{ ssr: false })


const MapContainer = () => {

    const dispatch = useDispatch()
    const filteredData = useSelector((state: RootState) => state.assets.assets)
    const initialData = useSelector((state: RootState) => state.assets.initialAssets)
    const mapPoints = useSelector((state: RootState) => state.assets.markers)

    function clearSelection(){
        dispatch(clearAllFilters('test'))
    }

    return(
        <section className={styles.mapSection} id='map'>
        <div className={styles.mapContainer}>
          <MapboxMap points={mapPoints}/>
        </div>
        <div className={styles.mapControlContainer}>
          <h2>Map control</h2>
          <div className={styles.mapFiltersContainer}>
            <DecadeSelector propId='mapDecadeSelector'/>
            <button onClick={clearSelection}>Clear Selection</button>
          </div>
          <div className={styles.tableContainerSmall}>
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
              })}
              
              </tbody>
            </table>
          </div>
        </div>
      </section>
    )

}

export default MapContainer
