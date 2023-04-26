import Link from 'next/link'
import Layout from '../components/Layout'
import MapboxMap from "../components/Mapbox";
import Table from '../components/Table';
import styles from "../styles/Index.module.css"
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Asset } from '../interfaces';
import { useEffect, useState } from 'react';
import Select, { InputActionMeta } from 'react-select'

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

  useEffect(()=>{
    
    //Here we are getting all the decades available in the database and inserting into the select element
    const decadesMixed = [...new Map(data.map((a) => [a.year, a.year])).values()].sort();
    const decadesOptions = decadesMixed.map((decade) => ({value: decade, label: decade}))
    setDecades(decadesOptions);

    //set Initial data that will be filtered soon
    setfilteredData(data)

    console.log(JSON.parse(data[0].riskFactors))
    
  },[])

  const handleChange = (selected:{value:number,label:number}[]) => {
    let numArr:number[] = []

    for(let val of selected){
      numArr.push(val.value)
    
  }
    setAssetsDecades(numArr)
    //filter by decade
    console.log(numArr)
  }
  
  return(

    <Layout title="Risk Thinking AI - Work Sample">
      <h1>Risk Thinking AI - Work Sample</h1>
      <section className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <MapboxMap assets={filteredData}/>
        </div>
        <div className={styles.mapControlContainer}>
          <h2>Map control</h2>
          <Select
            instanceId={'decadeSelector'}
            options={decades}
            isMulti
            defaultValue={decades[0]}
            isClearable
            isSearchable
            onChange={handleChange}
            name="decade"
          />
          <p>{selectedDecadesAssets}</p>
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
