import * as React from 'react'
import { Asset } from "../../interfaces";
import styles from "../../styles/Index.module.css"
import Select, { InputActionMeta } from 'react-select'

//Redux Imports
import type { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { setRatingNumber, setRatingComparator } from '../../redux/filtersSlice';

type allData = {
    data: Asset[]
  }
type Option = {value:string,label:string}
   
const RiskRatingSelector = () => {
    const selectedComparator = useSelector((state:RootState)=> state.filters.riskRatingComparator)
    const [generalValue, setSelectedVal] = React.useState(null)
    const [riskRating,setRiskRating] = React.useState([])
    const dispatch = useDispatch()

    const compareOptions = [
      {value:'Bigger',label:'Bigger than'},
      {value:'Smaller',label:'Smaller than'},
      {value:'Equals',label:'Equals to'}
    ]
    const handleChangeComparator = (selected:{value:string,label:string}) => {
        if(!selected){
            dispatch(setRatingComparator(''))
        }else{
            dispatch(setRatingComparator(selected.value))
        }
    }

    const handleChangeNumber = (num: number) => {
        if(!num){
            dispatch(setRatingNumber(0))
        }else{
        dispatch(setRatingNumber(num))
        }
    }


     //If there are multiple Selectors of the same kind this sincronize all of them,
    //It means if you change one, it changes all of them
    React.useEffect(()=>{
        const newVal = [{value:selectedComparator,label:selectedComparator}]
        setSelectedVal(newVal)    
      },[selectedComparator])

    return(
        <div className={styles.tableFilter}>
            <h3>Risk Rating</h3>
            <div className={styles.riskSelector}>
            <Select

                className={styles.comparatorSelector}
                instanceId={'comparator'}
                options={compareOptions}
                value={generalValue}
                isClearable
                isSearchable
                onChange={handleChangeComparator}
                name="comparator"
            />
            <input type='number' defaultValue={0} onChange={(e)=>handleChangeNumber(parseFloat(e.target.value))}></input>
            </div>
        </div>
    )

}

export default RiskRatingSelector
