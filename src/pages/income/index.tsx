import DataRibbon from '@/components/dashboard/DataRibbon/DataRibbon'
import TransactionBottomRow from '@/components/dashboard/TransactionBottomRow/TransactionBottomRow'
import TransactionsPerDay from '@/components/dashboard/TransactionsPerDay/TransactionsPerDay'
import {
  getAverageCostAllOrder,
  getConversionRate,
  getCountOrders,
  getTotalCostAllOrder,
} from '@/services/managerApi'
import { Container, Grid } from '@mui/material'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

export default function IncomePage() {
  const { data: session } = useSession()
  const { data: countOrders, error: e1 } = useSWR(
    session ? 'countOrders' : null,
    () => getCountOrders(session!.user.token)
  )
  const { data: totalValue, error: e2 } = useSWR(
    session ? 'totalValue' : null,
    () => getTotalCostAllOrder(session!.user.token)
  )
  const { data: avgOrderValue, error: e3 } = useSWR(
    session ? 'avgOrderValue' : null,
    () => getAverageCostAllOrder(session!.user.token)
  )
  const { data: conversionRate, error: e4 } = useSWR(
    session ? 'conversionRate' : null,
    () => getConversionRate(session!.user.token)
  )
  if (e1 || e2 || e3 || e4) return <div>failed to load</div>
  if (!countOrders || !totalValue || !avgOrderValue || !conversionRate)
    return <div>loading...</div>
    
  return (
    <Container>
      <Grid container gap={4} marginTop={2}>
        <DataRibbon
          countOrders={countOrders}
          totalValue={totalValue}
          avgOrderValue={avgOrderValue}
          conversionRate={conversionRate}
        />
        <TransactionsPerDay />
      </Grid>
      <TransactionBottomRow />
    </Container>
  )
}
