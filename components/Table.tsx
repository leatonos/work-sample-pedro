import * as React from 'react'
import { Asset } from "../interfaces";
import styles from "../styles/Index.module.css"

type tableProps = {
    assets: Asset[],
    maxRows: number
  }

type rowProps = {
 
}

const Table = ({assets,maxRows}: tableProps) => {

    const [tablePage,setTablePage] = React.useState<number>(3)
    const [tableSlice,setTableSlice] = React.useState<Asset[]>([])
    
    React.useEffect(()=>{
        if (typeof window === "undefined") return;

        //We are slicing the Array of Assets in smaller pieces for the table
        const startingRow:number = (tablePage-1)*maxRows
        const finalRow:number = maxRows*tablePage-1
        const rows:Asset[] = assets.slice(startingRow,finalRow)
        setTableSlice(rows)


    },[assets])

    return(
      <section className={styles.tableSection} id='table'>
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
    </section>
)

}

export default Table
