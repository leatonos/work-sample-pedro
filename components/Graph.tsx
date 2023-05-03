import * as React from 'react'
import { Asset } from "../interfaces";
import styles from "../styles/Index.module.css"
import Select, { InputActionMeta } from 'react-select'
import DecadeSelector from './selectors/DecadeSelector';
import RiskSelector from './selectors/RiskSelector';
import Image from 'next/image';
import arrowImg from '../public/img/arrow.svg'

//Redux Imports
import type { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { updateFilteredAssets } from '../redux/assetsSlice';

//Selectors and Filters imports
import AssetNameSelector from './selectors/AssetNameSelector';
import BusinessCategorySelector from './selectors/BussinessCategorySelector';
import RiskRatingSelector from './selectors/RiskRatingSelector';

//Chart imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type graphPoint = {
  riskRating: number,
  assets: Asset[],
  year: number,
  risks?:any
}

type risk ={
    riskName: string,
    averageRisk: number
}

const Graph = () => {
    
    const [datasets,setDatasets] = React.useState([])

    //Redux Selectors

    //This is the data from the Redux Store
    const assets:Asset[] = useSelector((state: RootState) => state.assets.assets)
    const initialData = useSelector((state: RootState) => state.assets.initialAssets)
    const assetNameFilters = useSelector((state: RootState) => state.filters.assetNameFilter)
    const riskFactorFilters = useSelector((state: RootState) => state.filters.riskFactorFilter)
    const categoryFilter = useSelector((state: RootState) => state.filters.categoryFilter)

//255, 89, 100
    //Returns all the decades available in the database
    const decades = [...new Map(initialData.map((a) => [a.year, a.year])).values()].sort();

    //Returns all the Business Categories in the database
    const businessCategories = [...new Map(initialData.map((a) => [a.businessCategory, a.businessCategory])).values()].sort();

    //Updates the graph according to the filters selected
    React.useEffect(()=>{
      
      let filteredResult:Asset[] = [...initialData]

      //Starts getting the filtered result when the user selects an asset
      if(assetNameFilters.length != 0){
        filteredResult = filteredResult.filter((asset)=>{return assetNameFilters.includes(asset.assetName)})
      }

      /*
        Here if the user selects one business category we make sure that only
        the categories chosen by the user will appear in the graph
      */
      let selectedCategories = []
      if(categoryFilter.length != 0){
        selectedCategories = categoryFilter
      }else{
        selectedCategories = businessCategories
      }

      //Creates an dataSet object for each business category
      const finalResult = selectedCategories.map((category,index)=>{

        //Initial value for each decade
        let graphPoints:graphPoint[] = decades.map((decade)=>{
          return { 
            riskRating: 0,
            assets: [],
            year: decade,
          }
        })

        //Get each asset and organize by category and feed with the information needed
        filteredResult.map((asset)=>{
          const decadeIndex = decades.indexOf(asset.year)
          if(asset.businessCategory == category){
            graphPoints[decadeIndex].riskRating += Number(asset.riskRating)
            graphPoints[decadeIndex].assets.push(asset)
          }
        })

        //Generate the datasets for the graph
        const graphPointsReady:graphPoint[] = graphPoints.map((point,index)=>{
          const pointAssets = point.assets
          
          let allRiskFactors = {}
          //for each asset inside the graph point get all the risk factors and sum all of them
          for(let i=0;i<pointAssets.length;i++){
            const riskFactors = JSON.parse(pointAssets[i].riskFactors)
            for(const risk in riskFactors){
              if(!allRiskFactors.hasOwnProperty(risk)){
                allRiskFactors[risk] = {
                  riskName:risk,
                  riskRate:riskFactors[risk],
                  numberOfvalues:1
                }
              }else{
                allRiskFactors[risk].riskRate += riskFactors[risk]
                allRiskFactors[risk].numberOfvalues += 1
                
              }
            }
          }

          //Calculates the average of every risk factor
          let averageOfEachRisk = []
          for(const riskFactor in allRiskFactors){
            const riskRatingAvg = allRiskFactors[riskFactor].riskRate/allRiskFactors[riskFactor].numberOfvalues
            const result = {
              riskName:allRiskFactors[riskFactor].riskName,
              averageRisk:riskRatingAvg
            }
            averageOfEachRisk.push(result)
          }
  
          return {
            riskRating:(point.riskRating/point.assets.length),
            assets:point.assets,
            year:point.year,
            risks:averageOfEachRisk
          }
        })

        return {
          label: category,
          data: graphPointsReady,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          parsing: {
            yAxisKey: 'riskRating',
            xAxisKey: 'year' 
          }
        }
      })

      setDatasets(finalResult)
       
    },[assetNameFilters,categoryFilter])

    const options = {
      updateMode:"resize",
      responsive: true,
      plugins: {
        tooltip:{
          callbacks:{
            label:((tooltipItem: any)=>{
              
            }),
            afterLabel:((tooltipItem: any)=>{
              const riskFactors:risk[] = (tooltipItem.raw.risks)
              const pointAssets:Asset[] = tooltipItem.raw.assets
              let riskString = ""
              
              riskFactors.map((factor)=>{
                riskString += `${factor.riskName}: ${factor.averageRisk.toFixed(2)} \n`
              })
              return(
                `Number of assets :${pointAssets.length} \n`+
                'Risk Factors: \n'+ riskString
              )
            })
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    let data = {
      decades,
      datasets: datasets
    };
    
    return(
      <section className={styles.graphSection} id='graph'>
        <div className={styles.graphFiltersContainer}>
          <AssetNameSelector/>
          <BusinessCategorySelector/>
        </div>
        <div className={styles.graphContainer}>
          <Line options={options} data={data}/>
        </div>
      </section>
)

}

export default Graph
