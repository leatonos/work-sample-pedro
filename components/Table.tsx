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
import { setMarkers, updateFilteredAssets } from '../redux/assetsSlice';
import AssetNameSelector from './selectors/AssetNameSelector';
import BusinessCategorySelector from './selectors/BussinessCategorySelector';
import RiskRatingSelector from './selectors/RiskRatingSelector';

type tableProps = {
    assets: Asset[],
    maxRows: number
  }
const Table = ({assets,maxRows}: tableProps) => {
    const dispatch = useDispatch()
    const [decades,setDecades] = React.useState([])
    const [tablePage,setTablePage] = React.useState<number>(1)
    const [tableSlice,setTableSlice] = React.useState<Asset[]>([])
    
    React.useEffect(()=>{
        if (typeof window === "undefined") return;
        //We are slicing the Array of Assets in smaller pieces for the table
        const startingRow:number = (tablePage-1)*maxRows
        const finalRow:number = maxRows*tablePage-1
        const rows:Asset[] = assets.slice(startingRow,finalRow)
        setTableSlice(rows)
    },[assets, tablePage])

    //This is the data from the Redux Store
    const initialData = useSelector((state: RootState) => state.assets.initialAssets)
    const assetNameFilters = useSelector((state: RootState) => state.filters.assetNameFilter)
    const decadeFilters = useSelector((state: RootState) => state.filters.decadesFilter)
    const riskFactorFilters = useSelector((state: RootState) => state.filters.riskFactorFilter)
    const categoryFilter = useSelector((state: RootState) => state.filters.categoryFilter)
    const riskRatingNumber = useSelector((state: RootState) => state.filters.riskRatingNumber)
    const riskRatingComparator = useSelector((state: RootState) => state.filters.riskRatingComparator)

    const currentData = useSelector((state: RootState) => state.assets.assets)


    //This makes sure we are updating the table everytime a filter changes
    React.useEffect(()=>{
     
      let filteredResult:Asset[] = [...initialData]
    
      //Filters by Asset name if asset selected
      if(assetNameFilters.length != 0){
        filteredResult = filteredResult.filter((asset)=>{return assetNameFilters.includes(asset.assetName)})
      }
      //Filters by Decade if decade selected
      if(decadeFilters.length != 0){
        filteredResult = filteredResult.filter((asset)=>{return decadeFilters.includes(asset.year)})
      }
      //Filters by Risk Factor
      if(riskFactorFilters.length != 0){
        filteredResult = filteredResult.filter((asset)=>{
          let hasTheRisk = false
          const assetRiskFactors = JSON.parse(asset.riskFactors)
          //checks if each asset has at least one of the risk factors selected by the user
          for(const factor in assetRiskFactors){
            if(riskFactorFilters.includes(factor)){
              hasTheRisk = true
              break;
            }
          }
          return hasTheRisk;

        })
      }
      //Filters by Business Category
      if(categoryFilter.length != 0){
        filteredResult = filteredResult.filter((asset)=>{return categoryFilter.includes(asset.businessCategory)})
      }

      //Filter by Risk Rating
      if(riskRatingComparator != ''){
        switch(riskRatingComparator){
          case 'Bigger':
            filteredResult = filteredResult.filter((asset)=>{return asset.riskRating > riskRatingNumber})
            break;
          case'Smaller':
            filteredResult = filteredResult.filter((asset)=>{return asset.riskRating < riskRatingNumber})
            break;
          case'Equals':
            filteredResult = filteredResult.filter((asset)=>{return asset.riskRating == riskRatingNumber})
            break;
        }
      }

      //Send the final filtered data to the redux store
      dispatch(updateFilteredAssets(filteredResult))
      dispatch(setMarkers(filteredResult))

      //After all the filters were applied we just need to go back to page 1 onf the table
      setTablePage(1)      
      
    },[assetNameFilters,decadeFilters,riskFactorFilters,riskRatingNumber,riskRatingComparator,categoryFilter])

    function previousPage(){

      console.log(tablePage)

      if(tablePage==1){
        return
      }else{
        let pageNum = tablePage
        setTablePage(tablePage - 1)
      }
    }
    function nextPage(){
      const lastPageNumber = Math.ceil(currentData.length/maxRows)
      if(tablePage < lastPageNumber){
        setTablePage(tablePage + 1) 
      }
    }
    return(
      <section className={styles.tableSection} id='table'>
        <div className={styles.tableFilters}>
          <AssetNameSelector/>
          <BusinessCategorySelector/>
          <DecadeSelector propId='tableDecadeSelector'/>
          <RiskSelector/>
          <RiskRatingSelector/>
        </div>
        <p>{assets.length} Results</p>
        <div className={styles.tableContainer}>
          <table className={styles.tableFixHead}>
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
            
              {tableSlice.map((asset,index)=>{
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
        <div className={styles.tablePagination}>
          <Image onClick={previousPage} className={styles.arrowLeft} src={arrowImg} alt='Left arrow'/>
          <p>{tablePage}</p>
          <Image onClick={nextPage} className={styles.arrowRight} src={arrowImg} alt='Right arrow'/>
        </div>
    </section>
)

}

export default Table
