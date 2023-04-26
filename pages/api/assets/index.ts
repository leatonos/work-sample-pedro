import { NextApiRequest, NextApiResponse } from 'next'
import { sampleUserData } from '../../../utils/sample-data'

const handler = async(_req: NextApiRequest, res: NextApiResponse) => {
  const fs = require('fs')
  const https = require('https')
  const csv = require('fast-csv');


  const data = []

  await https.get('https://pedrobaptista.com/work-sample/sample_data.csv',(stream)=>{
    stream.pipe(csv.parse({ headers: true }))
      .on('error', (error: any) => console.log(error))
      .on('data', (row: any) => data.push(row))
      .on('end', () => res.status(200).json(data));
  })
    
}

export default handler
