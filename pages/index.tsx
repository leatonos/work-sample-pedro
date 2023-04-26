import Link from 'next/link'
import Layout from '../components/Layout'
import Table from '../components/Table';
import styles from "../styles/Index.module.css"
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import dynamic from 'next/dynamic'
import { Asset, MarkerPoint } from '../interfaces';
import { useEffect, useState } from 'react';
import Select, { InputActionMeta } from 'react-select'

//Prevents server side rendering in the map component
const MapboxMap = dynamic(() => import('../components/Mapbox'),{ ssr: false })

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
  const [selectedDecadesAssets, setAssetsDecades] = useState<number[]>([])
  const [filteredData,setfilteredData] = useState<Asset[]>([])
  const [mapPoints,setMapPoints] = useState<MarkerPoint[]>([])

  useEffect(()=>{

     //set initial markers
     updatePoints(data)
     //set Initial data that will be filtered soon
     setfilteredData(data)
    
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
    setAssetsDecades(numArr)
    
    //If no decade selected just show all the data again
    if (numArr.length == 0){
      setfilteredData(data)
      return
    }
    
    //filter by decade using the decades you choose
    const dataCopy = [...data]
    const filteredResult = dataCopy.filter((asset)=>{return numArr.includes(asset.year)})
    setfilteredData(filteredResult)
    updatePoints(filteredResult)

  }
  
  return(

    <Layout title="Risk Thinking AI - Work Sample">
      <h1>Risk Thinking AI - Work Sample</h1>
      <section className={styles.mapSection}>
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

      <section className={styles.tableSection}>
        <div className={styles.tableContainer}>
          <table>
            <thead>
            <tr>
              <th>Asset Name</th>
              <th>Lat</th>
              <th>Long</th>
              <th>Business Category</th>
              <th>Risk Rating</th>
              <th>Risk Factors</th>
              <th>Year</th>
            </tr>
            </thead>
            <tbody>

            {filteredData.map((asset,index)=>{
              const riskFactors = JSON.parse(asset.riskFactors)

              let riskFactorsArr: string[] = []

              for(const property in riskFactors){
                riskFactorsArr.push(`${property} ${riskFactors[property]} `)
              }
             
              return(
                <tr key={index}>
                  <td>{asset.assetName}</td>
                  <td>{asset.lat}</td>
                  <td>{asset.long}</td>
                  <td>{asset.businessCategory}</td>
                  <td>{asset.riskRating}</td>
                  <td>{riskFactorsArr.map((factor,index)=>
                    <p key={index}>{factor}</p>
                  )}</td>
                  <td>{asset.year}</td>
                </tr>
              )
            }
            )}

            </tbody>
           
          </table>
        </div>
      </section>
      
      
    </Layout>
  )

} 

export default IndexPage
