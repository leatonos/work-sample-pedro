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
const MapboxMap = dynamic(() => import('../components/Mapbox'),{ ssr: false })
const Table = dynamic(()=>import('../components/Table'),{ssr:false})

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
    
    //Here we are getting all the decades available in the database and inserting into the select element
    const decadesMixed = [...new Map(data.map((a) => [a.year, a.year])).values()].sort();
    const decadesOptions = decadesMixed.map((decade) => ({value: decade, label: decade}))
    setDecades(decadesOptions);
    
    
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


  const handleChangeDecade = (selected:{value:number,label:number}[]) => {
    
    //assemble all the decades selected
    let numArr:number[] = []
    for(let val of selected){
      numArr.push(val.value)
    }
    
    //If no decade selected just show all the data again
    if (numArr.length == 0){
      dispatch(updateFilteredAssets(data))
      return
    }
    
    //filter by decade using the decades you choose
    const dataCopy = [...data]
    const filteredResult = dataCopy.filter((asset)=>{return numArr.includes(asset.year)})
    dispatch(updateFilteredAssets(filteredResult))
    updatePoints(filteredResult)
    console.log(numArr.length)

  }
  
  return(

    <Layout title="Risk Thinking AI - Work Sample">
      
      <section className={styles.mapSection} id='map'>
        
        <div className={styles.mapContainer}>
        
          <MapboxMap points={mapPoints}/>
        </div>
        <div className={styles.mapControlContainer}>
          <h2>Map control</h2>
          <div>
          <h3>Decade</h3>
            <Select
              instanceId={'decadeSelector'}
              options={decades}
              isMulti
              defaultValue={decades[0]}
              isClearable
              isSearchable
              onChange={handleChangeDecade}
              name="decade"
            />
          </div>
          <div>

          </div>  
        </div>
      </section>
      
      <Table assets={filteredData} maxRows={100}/>
      
    </Layout>
  )

} 

export default IndexPage
