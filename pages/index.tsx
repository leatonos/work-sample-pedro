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
        <h2>This Project</h2>
        <p>This is a work sample made for riskthinking.AI.</p>
        <p>
          It was pretty fun to develop this, and I learned a lot in the process. I decided to make this
          short text to thank you for the opportunity and explain that the risk values that 
          appear on the map and in the graph are averages calculated based on the assets that were filtered.
        </p>
        <p>I really hope to have the chance to learn more about your company and the role, and to meet the team.</p>
        <h2>References</h2>
        <p>You can check the tutorials I used to create this website below:</p>
        <h4>Using Mapbox with React and Next</h4>
        <a href='https://dev.to/dqunbp/using-mapbox-gl-in-react-with-next-js-2glg
'>https://dev.to/dqunbp/using-mapbox-gl-in-react-with-next-js-2glg
</a>
        <h4>Redux with Typescript</h4>
        <a href='https://redux-toolkit.js.org/tutorials/typescript'>
        https://redux-toolkit.js.org/tutorials/typescript
        </a>
        <h4>Next and Typescript</h4>
        <a href='https://nextjs.org/docs/basic-features/typescript'>https://nextjs.org/docs/basic-features/typescript</a>
        <h4>How to create Clusters in Mapbox</h4>
        <a href='https://docs.mapbox.com/mapbox-gl-js/example/cluster/'>https://docs.mapbox.com/mapbox-gl-js/example/cluster/</a>
        <h4>Add custom markers in Mapbox GL JS</h4>
        <a href='https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/'>https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/</a>
      </section>
      
    </Layout>
  )

} 

export default IndexPage
