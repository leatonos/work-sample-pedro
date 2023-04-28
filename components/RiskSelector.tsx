import * as React from 'react'
import { Asset } from "../interfaces";
import styles from "../styles/Index.module.css"
import Select, { InputActionMeta } from 'react-select'

//Redux Imports
import type { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { updateFilteredAssets, setMarkers } from '../redux/assetsSlice';

type allData = {
    data: Asset[]
  }
   
const RiskSelector = () => {
    const initialAssets: Asset[] = useSelector((state:RootState)=> state.assets.initialAssets)
    const assets:Asset[] = useSelector((state: RootState) => state.assets.assets)
    const [risks,setRisks] = React.useState([])
    const dispatch = useDispatch()
    
    React.useEffect(()=>{
        let listOfRisks = []
        for(const asset of assets){
            const assetRisks = JSON.parse(asset.riskFactors)
            for(const risk in assetRisks){
                if(!listOfRisks.includes(risk)){
                    listOfRisks.push(risk)
                }
            }
        }
        setRisks(listOfRisks.map((risk)=>{return {value: risk, label: risk}}))

    },[])


    const handleChangeDecade = (selected:{value:number,label:number}[]) => {
    
      //assemble all the decades selected
      let numArr:number[] = []
      for(let val of selected){
        numArr.push(val.value)
      }
      
      //If no decade selected just show all the data again
      if (numArr.length == 0){
        dispatch(updateFilteredAssets(initialAssets))
        return
      }
      
      //filter by decade using the decades you choose
      const dataCopy = [...initialAssets]
      const filteredResult = dataCopy.filter((asset)=>{return numArr.includes(asset.year)})
      dispatch(updateFilteredAssets(filteredResult))
      console.log(numArr.length)
  
    }

    return(
        <div>
            <h3>Risk Factor</h3>
            <Select
                instanceId={'riskSelector'}
                options={risks}
                isMulti
                isClearable
                isSearchable
                //onChange={handleChangeDecade}
                name="decade"
            />
        </div>
    )

}

export default RiskSelector
