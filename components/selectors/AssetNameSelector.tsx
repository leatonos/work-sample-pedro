import * as React from 'react'
import { Asset } from "../../interfaces";
import styles from "../../styles/Index.module.css"
import Select, { InputActionMeta } from 'react-select'

//Redux Imports
import type { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { setAssetFilter } from '../../redux/filtersSlice';
   
const AssetNameSelector = () => {
    const selectedVal = useSelector((state:RootState)=> state.filters.assetNameFilter)
    const [generalValue, setSelectedVal] = React.useState(null)
    const assets:Asset[] = useSelector((state: RootState) => state.assets.assets)
    const initialAssets:Asset[] = useSelector((state: RootState) => state.assets.initialAssets)
    const dispatch = useDispatch()
    
    //Gets all the different Assets names in the database and create a list of options
    const assetsNamesMixed = [...new Map(initialAssets.map((a) => [a.assetName, a.assetName])).values()].sort();
    const assetsOptions = assetsNamesMixed.map((assetName) => ({value: assetName, label: assetName}))

    //If there are multiple Selectors of the same kind this sincronize all of them,
    //It means if you change one, it changes all of them
     React.useEffect(()=>{
        const newVal = selectedVal.map((val)=>{
          return {value:val,label:val}
        })
        setSelectedVal(newVal)    
      },[selectedVal])

    const handleChangeAssetName = (selected:{value:string,label:string}[]) => {
    
      //assemble all the Assets names selected
      let assetNameArr:string[] = []
      for(let val of selected){
        assetNameArr.push(val.value)
      }
      //Send Selected Decades for the Redux Store
      dispatch(setAssetFilter(assetNameArr))
    }

    return(
        <div className={styles.tableFilter}>
            <h3>Asset Name</h3>
            <Select
                instanceId={'assetSelector'}
                options={assetsOptions}
                value={generalValue}
                isMulti
                isClearable
                isSearchable
                onChange={handleChangeAssetName}
                name="AssetName"
            />
        </div>
    )

}

export default AssetNameSelector
