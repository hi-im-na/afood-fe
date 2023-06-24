import { IFood, IOrder } from '@/models/models'
import {
  fetchFoodsByOrderId,
  fetchOrderFoodByOrderId,
  fetchOrders,
  putOrderStatus,
} from '@/services/managerApi'
import formatDate from '@/utils/formatDate'
import { Close, Done, Info, Restaurant } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useSWR, { mutate } from 'swr'

const statusColor = (status: string) => {
  switch (status) {
    case 'SERVING':
      return 'warning'
    case 'PAID':
      return 'success'
    case 'CANCELLED':
      return 'error'
    default:
      return 'primary'
  }
}

const statusIcon = (status: string) => {
  switch (status) {
    case 'SERVING':
      return <Restaurant />
    case 'PAID':
      return <Done />
    case 'CANCELLED':
      return <Close />
    default:
      return <Info />
  }
}

export default function OrderPage() {
  const theme = useTheme()
  const { data: session } = useSession()
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [statusSelection, setStatusSelection] = useState('')
  const [orderId, setOrderId] = useState('')
  const [foodsInOrder, setFoodsInOrder] = useState<IFood[]>([])
  const [foodsQuantity, setFoodsQuantity] = useState<FoodsQuantity>({})

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusSelection(event.target.value)
  }
  let ordersTable
  interface FoodsQuantity {
    [key: string]: number
  }

  //fetch orders
  const {
    data: orders,
    isLoading,
    error,
  } = useSWR<IOrder[]>(session ? 'fetchOrders' : null, () =>
    fetchOrders(session!.user.token)
  )

  // table definition
  const rows: GridRowsProp =
    orders?.map((order) => {
      return {
        ...order,
        orderInTime: formatDate(order.orderInTime),
        orderOutTime: formatDate(order.orderOutTime),
        orderStatus: order.orderStatus,
      }
    }) || []

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 80 },
    { field: 'orderInTime', headerName: 'In Time', width: 130 },
    { field: 'orderOutTime', headerName: 'Out Time', width: 130 },
    { field: 'tableSittingId', headerName: 'Table', width: 50 },
    { field: 'staffId', headerName: 'Staff Id', width: 70 },
    { field: 'totalCost', headerName: 'Total Cost', width: 100 },
    {
      field: 'orderStatus',
      headerName: 'orderStatus',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.row.orderStatus}
          icon={statusIcon(params.row.orderStatus)}
          color={statusColor(params.row.orderStatus)}
          variant="outlined"
        />
      ),
    },
  ]

  const rows2: GridRowsProp = foodsInOrder || []
  const columns2: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 100 },
    { field: 'name', headerName: 'name', width: 200 },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 75,
      sortable: false,
      renderCell: (params) => {
        return <Typography>{foodsQuantity[params.row.id]}</Typography>
      },
    },
  ]

  //handle
  const handleSelectionModelChange = (newSelectionModel: any) => {
    setSelectedRowIds(newSelectionModel)

    const selectedRows = newSelectionModel.map((rowId: any) =>
      rows.find((row) => row.id === rowId)
    )
    const selectedRowIds = selectedRows.map((row: any) => row.id)
  }
  const handleStatusChangeSubmit = async (event: any) => {
    event.preventDefault()
    selectedRowIds.forEach(async (id: any) => {
      let res = await putOrderStatus(id, statusSelection, session!.user.token)
    })
    mutate('fetchOrders', () => fetchOrders(session!.user.token))
  }

  const handleOnOrderIdChange = (event: any) => {
    setOrderId(event.target.value)
  }

  async function handleConfirmOrderShow(e: any) {
    e.preventDefault()
    // fetch order info
    let res = await fetchFoodsByOrderId(orderId, session!.user.token)
    let orderFoodRes = await fetchOrderFoodByOrderId(
      orderId,
      session!.user.token
    )
    if (res && orderFoodRes) {
      setFoodsInOrder(res)
      let orderFoodQuantities = orderFoodRes.map(
        (orderFood) => orderFood.quantity
      )
      let orderFoodIds = orderFoodRes.map((orderFood) => orderFood.foodId)

      const result: { [key: string]: number } = orderFoodIds.reduce(
        (acc, orderFoodId, index) => {
          acc[orderFoodId] = orderFoodQuantities[index]
          return acc
        },
        {} as { [key: string]: number }
      )
      setFoodsQuantity(result)
    } else {
      setFoodsInOrder([])
    }
  }
  //ordersTable
  if (isLoading) ordersTable = <div>Loading tables...</div>
  else {
    ordersTable = (
      <>
        <Box component="div" display="flex" alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="body1" component="span">
            Set status for selected orders: &nbsp;
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="order-status">Status</InputLabel>
            <Select
              sx={{ bgcolor: theme.palette.background.paper }}
              labelId="order-status"
              id="order-status-select"
              value={statusSelection}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value={'CANCELLED'}>CANCELLED</MenuItem>
              <MenuItem value={'PAID'}>PAID</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            onClick={(e) => handleStatusChangeSubmit(e)}
          >
            Submit
          </Button>
        </Box>
      </>
    )
  }

  if (error) ordersTable = <div>Failed to load table</div>

  return (
    <>
      <Box display="flex" sx={{ m: 2 }}>
        <Box sx={{ width: '60%' , pl: 1}}>
          <Typography variant="h3" component="h1">
            Manage order table
          </Typography>
        </Box>
        <Box sx={{ width: '40%' , pr: 1}} display="flex" alignItems="center">
          <Typography variant="body1" component="h5">
            Choose the order you want to see:
          </Typography>
          <InputLabel id="orderId" />
          &nbsp;
          <TextField
            sx={{ bgcolor: theme.palette.background.paper, width: '20%' }}
            label="orderId"
            id="order-id"
            value={orderId}
            onChange={handleOnOrderIdChange}
            size="small"
          />
          &nbsp;
          <Button
            type="submit"
            variant="contained"
            onClick={(e: any) => handleConfirmOrderShow(e)}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Box display="flex">
        <Box sx={{ width: '60%', pr: 1 }}>
          <DataGrid
            sx={{ bgcolor: theme.palette.background.paper }}
            rows={rows}
            columns={columns}
            style={{ height: 600 }}
            checkboxSelection
            rowSelectionModel={selectedRowIds}
            onRowSelectionModelChange={handleSelectionModelChange}
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'desc' }],
              },
              pagination: {
                // paginationModel: { page: 0, pageSize: 10 },
              },
            }}
          />
          {ordersTable}
        </Box>
        <Box sx={{ width: '40%', pl: 1 }}>
          <DataGrid
            sx={{ bgcolor: theme.palette.background.paper }}
            rows={foodsInOrder}
            columns={columns2}
            style={{ height: 600 }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'asc' }],
              },
            }}
          />
        </Box>
      </Box>
    </>
  )
}
