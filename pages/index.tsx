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
 
     //set Initial data that will be filtered by the user
     dispatch(setMarkers(data))
     dispatch(updateFilteredAssets(data))
     dispatch(setInitialData(data))
        
  },[])



  return(

    <Layout title="Risk Thinking AI - Work Sample">
      
      <MapContainer />
      <Table assets={filteredData} maxRows={100}/>
      <Graph />
      <section className={styles.aboutSection} id='about'>
        <h1>About</h1>
        <p>This is a work sample made for riskthinking.AI.</p>
        <p>
          It was pretty fun to develop this, and I learned a lot in the process. I decided to make this
          short text to thank you for the opportunity and explain that the risk values that 
          appear on the map and in the graph are averages calculated based on the assets that were filtered.
        </p>
        <p>I really hope to have the chance to learn more about your company and the role, and to meet the team.</p>
      </section>
      
    </Layout>
  )

} 

export default IndexPage
