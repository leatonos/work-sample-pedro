import * as React from 'react'
import { Asset } from "../../interfaces";
import styles from "../../styles/Index.module.css"
import Select, { InputActionMeta } from 'react-select'

//Redux Imports
import type { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { setCategoryFilter } from '../../redux/filtersSlice';
   
const BusinessCategorySelector = () => {
    const selectedVal = useSelector((state:RootState)=> state.filters.categoryFilter)
    const [generalValue, setSelectedVal] = React.useState(null)
    const assets:Asset[] = useSelector((state: RootState) => state.assets.assets)
    const initialAssets:Asset[] = useSelector((state: RootState) => state.assets.initialAssets)
   
    const dispatch = useDispatch()
    const assetsbussiness = [...new Map(initialAssets.map((a) => [a.businessCategory, a.businessCategory])).values()].sort();
    const bussinessOptions = assetsbussiness.map((assetName) => ({value: assetName, label: assetName}))
    
    


     //If there are multiple Selectors of the same kind this sincronize all of them,
     //It means if you change one, it changes all of them
     React.useEffect(()=>{

        const newVal = selectedVal.map((val)=>{
          return {value:val,label:val}
        })
        setSelectedVal(newVal)    
      },[selectedVal])

    const handleChangeBusinessCategory = (selected:{value:string,label:string}[]) => {
    
      //assemble all the Assets names selected
      let businessArr:string[] = []
      for(let val of selected){
        businessArr.push(val.value)
      }
      //Send Selected Decades for the Redux Store
      dispatch(setCategoryFilter(businessArr))
    }

    return(
        <div className={styles.tableFilter}>
            <h3>Business Category</h3>
            <Select
                instanceId={'assetSelector'}
                options={bussinessOptions}
                value={generalValue}
                isMulti
                isClearable
                isSearchable
                onChange={handleChangeBusinessCategory}
                name="BussinecsCategory"
            />
        </div>
    )

}

export default BusinessCategorySelector
