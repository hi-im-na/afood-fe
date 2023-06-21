import DataRibbon from '@/components/dashboard/DataRibbon/DataRibbon'
import TransactionBottomRow from '@/components/dashboard/TransactionBottomRow/TransactionBottomRow'
import TransactionsPerDay from '@/components/dashboard/TransactionsPerDay/TransactionsPerDay'
import { Container, Grid } from '@mui/material'

export default function IncomePage() {
  return (
    <Container>
      <Grid container gap={4} marginTop={2}>
        <DataRibbon />
        <TransactionsPerDay />
      </Grid>
      <TransactionBottomRow />
    </Container>
  )
}
