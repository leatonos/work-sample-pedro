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
   

const DecadeSelector = ({data}: allData) => {
    const initialAssets: Asset[] = useSelector((state:RootState)=> state.assets.initialAssets)
    const assets:Asset[] = useSelector((state: RootState) => state.assets.assets)
    const [decades,setDecades] = React.useState([])
    const dispatch = useDispatch()
    
    React.useEffect(()=>{
        const decadesMixed = [...new Map(assets.map((a) => [a.year, a.year])).values()].sort();
        const decadesOptions = decadesMixed.map((decade) => ({value: decade, label: decade}))
        console.log(decadesOptions)
        setDecades(decadesOptions);
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
            <h3>Decade</h3>
            <Select
                instanceId={'decadeSelector'}
                options={decades}
                isMulti
                defaultValue={decades[0]}
                isClearable
                isSearchable
                onChange={handleChangeDecade}
                name="decade"
            />
        </div>
    )

}

export default DecadeSelector
