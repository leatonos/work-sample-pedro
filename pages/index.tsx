import Link from 'next/link'
import Layout from '../components/Layout'
import styles from "../styles/Index.module.css"
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import dynamic from 'next/dynamic'
import { Asset, MarkerPoint } from '../interfaces';
import { useEffect, useState } from 'react';
import Select, { InputActionMeta } from 'react-select'

//Redux Imports
import type { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { updateFilteredAssets, setMarkers,setInitialData } from '../redux/assetsSlice';

//Prevents server side rendering for some components
const MapContainer = dynamic(() => import('../components/MapContainer'),{ ssr: false })
const Table = dynamic(()=>import('../components/Table'),{ssr:false})
const Graph = dynamic(()=>import('../components/Graph'),{ssr:false})

export const getServerSideProps: GetServerSideProps<{ data: Asset[] }> = async (context) => {

  //makes sure it will find the correct URL for the API request
  const dev = process.env.NODE_ENV !== 'production';
  const serverURL = dev ? 'http://localhost:3000' : 'https://work-sample-pedro.vercel.app/';

  const res = await fetch(`${serverURL}/api/assets`)
  const data: Asset[] = await res.json()

  return {
    props: {
      data,
    },
  }
}

const IndexPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) =>{

  const [decades,setDecades] = useState([])
  const dispatch = useDispatch()
  const filteredData = useSelector((state: RootState) => state.assets.assets)
  const [mapPoints,setMapPoints] = useState<MarkerPoint[]>([])

  useEffect(()=>{

     //set initial markers
     updatePoints(data)
     //set Initial data that will be filtered soon
     dispatch(updateFilteredAssets(data))
     dispatch(setInitialData(data))
        
  },[])

  const updatePoints=(assets: Asset[])=>{
    let markerPoints: MarkerPoint[]=[]
    for(let asset of assets){

      const newLocation = [asset.long,asset.lat]
      
      let markerFound = false 

      //Checks if this point already exist in the map or not
      for(const marker of markerPoints){
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

    <Layout title="Risk Thinking AI - Work Sample">
      
      <MapContainer />
      <Table assets={filteredData} maxRows={100}/>
      <Graph />
      
    </Layout>
  )

} 

export default IndexPage
