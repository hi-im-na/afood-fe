import { ITableRestaurant } from '@/models/models'
import { Box, Paper } from '@mui/material'
import TableInArea from './TableInArea'

interface TableAreaProps {
  tablesInArea: ITableRestaurant[]
}

export default function TablesInArea({ tablesInArea }: TableAreaProps) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {tablesInArea.map((table) => (
          <Paper
            key={table.id}
            sx={{
              mr: 1,
            }}
          >
            <TableInArea tableInArea={table} />
          </Paper>
        ))}
      </Box>
    </>
  )
}
