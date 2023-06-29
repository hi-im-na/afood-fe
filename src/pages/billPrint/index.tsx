import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

export default function BillPrintPage() {
  const [row1, setRow1] = useState<any>([])
  const [foodsInOrder, setFoodsInOrder] = useState<any>([])
  const [foodsQuantity, setFoodsQuantity] = useState<any>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRow1(JSON.parse(sessionStorage.getItem('row1')!))
      setFoodsInOrder(JSON.parse(sessionStorage.getItem('foodsInOrder')!))
      setFoodsQuantity(JSON.parse(sessionStorage.getItem('foodsQuantity')!))
    }
    const handleBeforePrint = () => {
      setTimeout(() => {
        window.close()
      }, 0)
    }
  
    setTimeout(() => {
      window.print()
    }, 500)
  
    window.addEventListener('beforeprint', handleBeforePrint)
  
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint)
    }
  }, [])

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Typography variant="h4" component="h2" gutterBottom>
            Bill #{row1.id}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="h4" component="h2" gutterBottom>
            Time out: {row1.orderOutTime}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="h4" component="h2" gutterBottom>
            Table: {row1.tableSittingId}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="h4" component="h2" gutterBottom>
            Total: {row1.totalCost}
          </Typography>
        </Grid>
        <ul>
          {foodsInOrder.map((row: any) => (
            <li key={row.id}>
              <Typography variant="h5" component="h2" gutterBottom>
                {row.name} x {foodsQuantity[row.id]}
              </Typography>
            </li>
          ))}
        </ul>
        <Grid item xs={12} md={12}>
          <Typography variant="h4" component="h2" gutterBottom>
            Total Cost: {row1.totalCost}$
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="h5" component="h2" gutterBottom>
            Thank you for your visit!
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}
