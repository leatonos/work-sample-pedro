import * as React from 'react'
import { Asset } from "../../interfaces";
import styles from "../../styles/Index.module.css"
import Select, { InputActionMeta } from 'react-select'

//Redux Imports
import type { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { setAssetFilter } from '../../redux/filtersSlice';
   
const AssetNameSelector = () => {
    const assets:Asset[] = useSelector((state: RootState) => state.assets.assets)
    const [assetsNames,setAssetsNames] = React.useState([])
    const dispatch = useDispatch()
    
    //Gets all the different Assets names in the database and create a list of options
    React.useEffect(()=>{
        const assetsNamesMixed = [...new Map(assets.map((a) => [a.assetName, a.assetName])).values()].sort();
        const assetsOptions = assetsNamesMixed.map((assetName) => ({value: assetName, label: assetName}))
        console.log(assetsOptions)
        setAssetsNames(assetsOptions);
    },[])


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
                options={assetsNames}
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
