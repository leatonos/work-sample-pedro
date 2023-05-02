import * as React from 'react'
import { Asset } from "../../interfaces";
import styles from "../../styles/Index.module.css"
import Select, { InputActionMeta } from 'react-select'

//Redux Imports
import type { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { setDecadeFilter } from '../../redux/filtersSlice';

type selectorProps = {
    propId: string
  }
   
const DecadeSelector = ({propId}: selectorProps) => {
    const initialAssets: Asset[] = useSelector((state:RootState)=> state.assets.initialAssets)
    const selectedVal = useSelector((state:RootState)=> state.filters.decadesFilter)
    const assets:Asset[] = useSelector((state: RootState) => state.assets.assets)
    const [decades,setDecades] = React.useState([])
    const [generalValue, setSelectedVal] = React.useState(null)
    const dispatch = useDispatch()
    
    //Gets all the different decades in the database and create a list of options
    React.useEffect(()=>{
        const decadesMixed = [...new Map(assets.map((a) => [a.year, a.year])).values()].sort();
        const decadesOptions = decadesMixed.map((decade) => ({value: decade, label: decade}))
        console.log(decadesOptions)
        setDecades(decadesOptions); 
       
    },[])


     //
     React.useEffect(()=>{

      const newVal = selectedVal.map((val)=>{
        return {value:val,label:val}
      })

      console.log("I should be working")
      setSelectedVal(newVal)
     
    },[selectedVal])



    const handleChangeDecade = (selected:{value:number,label:number}[]) => {
    
      //assemble all the decades selected
      let decadeArr:number[] = []
      for(let val of selected){
        decadeArr.push(val.value)
      }

  

      //Send Selected Decades for the Redux Store
      dispatch(setDecadeFilter(decadeArr))
    }

    

    return(
        <div className={styles.tableFilter}>
            <h3>Decade</h3>
            <Select
                instanceId={propId}
                id={propId}
                options={decades}
                value={generalValue}
                isMulti
                isClearable
                isSearchable
                onChange={handleChangeDecade}
                name="decade"
            />
        </div>
    )

}

export default DecadeSelector
