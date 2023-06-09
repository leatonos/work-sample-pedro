import * as React from 'react'
import { Asset } from "../../interfaces";
import styles from "../../styles/Index.module.css"
import Select, { InputActionMeta } from 'react-select'

//Redux Imports
import type { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { setRiskFactorFilter } from '../../redux/filtersSlice';

   
const RiskSelector = () => {
    const selectedVal = useSelector((state:RootState)=> state.filters.riskFactorFilter)
    const [generalValue, setSelectedVal] = React.useState(null)
    const initialAssets: Asset[] = useSelector((state:RootState)=> state.assets.initialAssets)
    const assets:Asset[] = useSelector((state: RootState) => state.assets.assets)
    const dispatch = useDispatch()
    
    //Creates a lisk with all different risks of the table
    let listOfRisks = []
    for(const asset of assets){
        const assetRisks = JSON.parse(asset.riskFactors)
        for(const risk in assetRisks){
            if(!listOfRisks.includes(risk)){
                listOfRisks.push(risk)
            }
        }
    }

    const risks = (listOfRisks.map((risk)=>{return {value: risk, label: risk}}))
   


    const handleChangeRiskFactor = (selected:{value:string,label:string}[]) => {
    
      //assemble all the risks selected
      let riskArr:string[] = []
      for(let val of selected){
        riskArr.push(val.value)
      }
      dispatch(setRiskFactorFilter(riskArr))
    }

     //If there are multiple Selectors of the same kind this sincronize all of them,
    //It means if you change one, it changes all of them
    React.useEffect(()=>{
        const newVal = selectedVal.map((val)=>{
          return {value:val,label:val}
        })
        setSelectedVal(newVal)    
      },[selectedVal])

    return(
        <div className={styles.tableFilter}>
            <h3>Risk Factor</h3>
            <Select
                instanceId={'riskSelector'}
                options={risks}
                value={generalValue}
                isMulti
                isClearable
                isSearchable
                onChange={handleChangeRiskFactor}
                name="decade"
            />
        </div>
    )

}

export default RiskSelector
