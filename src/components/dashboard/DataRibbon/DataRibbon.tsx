import { Grid } from '@mui/material'
import DataCard from '@/components/dashboard/DataCard/DataCard'
// import scss from './DataRibbon.module.scss'

interface DataRibbonProps {
  countOrders: number
  totalValue: number
  avgOrderValue: number
  conversionRate: number
}

const DataRibbon = ({
  countOrders,
  totalValue,
  avgOrderValue,
  conversionRate,
}: DataRibbonProps) => {
  return (
    <Grid container gap={2} 
    // className={scss.dataRibbon}
    sx={{
      display: "grid",
      textAlign: "center",
      gridTemplateColumns: "repeat(4, 1fr)",
    }}
    >
      <Grid>
        <DataCard
          title={'Total Sales'}
          value={countOrders.toString()}
          description={
            'The totals of all DataSoft products in the current financial year'
          }
        />
      </Grid>
      <Grid>
        <DataCard
          title={'Total Value'}
          value={'$' + totalValue.toString()}
          description={'The total sales of the current financial year'}
        />
      </Grid>
      <Grid>
        <DataCard
          title={'Avg. Order Value'}
          value={'$' + avgOrderValue.toString()}
          description={
            'The average order value for all sales this current financial year'
          }
        />
      </Grid>
      <Grid>
        <DataCard
          title={'Conversion rate'}
          value={conversionRate.toString() + '%'}
          description={'How many pitches become sales'}
        />
      </Grid>
    </Grid>
  )
}

export default DataRibbon
