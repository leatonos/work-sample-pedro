import * as React from 'react'
import { Asset } from "../../interfaces";
import styles from "../../styles/Index.module.css"
import Select, { InputActionMeta } from 'react-select'

//Redux Imports
import type { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { setCategoryFilter } from '../../redux/filtersSlice';
   
const BusinessCategorySelector = () => {
    const assets:Asset[] = useSelector((state: RootState) => state.assets.assets)
    const [businessCategories,setBusinessCategories] = React.useState([])
    const dispatch = useDispatch()
    
    //Gets all the different Business Categories in the database and create a list of options with 
    React.useEffect(()=>{
        const assetsbussiness = [...new Map(assets.map((a) => [a.businessCategory, a.businessCategory])).values()].sort();
        const bussinessOptions = assetsbussiness.map((assetName) => ({value: assetName, label: assetName}))
        console.log(bussinessOptions)
        setBusinessCategories(bussinessOptions);
    },[])


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
                options={businessCategories}
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
