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

  useEffect(()=>{
    
    //Here we are getting all the decades available in the database and inserting into the select element
    const decadesMixed = [...new Map(data.map((a) => [a.year, a.year])).values()].sort();
    const decadesOptions = decadesMixed.map((decade) => ({value: decade, label: decade}))
    setDecades(decadesOptions);

    console.log(JSON.parse(data[0].riskFactors))
    
  },[])

  const handleChange = (selected:{value:number,label:number}[]) => {

    let numArr:number[] = []
    
    for(let val of selected){
      numArr.push(val.value)
    }

    setAssetsDecades(numArr)
  }
  
  return(

    <Layout title="Risk Thinking AI - Work Sample">
      <h1>Risk Thinking AI - Work Sample</h1>
      <section className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <MapboxMap assets={data}/>
        </div>
        <div className={styles.mapControlContainer}>
          <h2>Map control</h2>
          <Select 
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
        <Table assets={data}/>
        </div>
      </section>
      
      
    </Layout>
  )

} 

export default IndexPage
