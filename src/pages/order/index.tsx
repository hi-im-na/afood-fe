import { IFood, IOrder } from '@/models/models'
import {
  fetchFoodsByOrderId,
  fetchOrderFoodByOrderId,
  fetchOrders,
  putOrderStatus,
} from '@/services/managerApi'
import formatDate from '@/utils/formatDate'
import { Close, Done, Info, Print, Restaurant } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
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
  const [foodsQuantity, setFoodsQuantity] = useState<IFoodsQuantity>({})
  const tabletCheck = useMediaQuery('(min-width: 1025px)')
  const mobileCheck = useMediaQuery('(min-width: 600px)')

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusSelection(event.target.value)
  }
  let ordersTable
  interface IFoodsQuantity {
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
    { field: 'id', headerName: 'id', flex: 1, sortable: false },
    { field: 'orderInTime', headerName: 'In Time', flex: 3 },
    { field: 'orderOutTime', headerName: 'Out Time', flex: 3 },
    { field: 'tableSittingId', headerName: 'Table', flex: 1, sortable: false },
    // { field: 'staffId', headerName: 'Staff Id', flex: 2, sortable: false },
    { field: 'totalCost', headerName: 'Total', flex: 2, sortable: false },
    {
      field: 'orderStatus',
      headerName: 'Status',
      flex: 3,
      sortable: false,
      renderCell: (params) => (
        <>
          <Chip
            label={tabletCheck ? params.row.orderStatus : ''}
            icon={statusIcon(params.row.orderStatus)}
            color={statusColor(params.row.orderStatus)}
            variant="outlined"
          />
          {params.row.orderStatus === 'PAID' ? (
            <IconButton
              onClick={() =>
                handleClickPrint(
                  params.row as IOrder,
                  foodsInOrder,
                  foodsQuantity
                )
              }
            >
              <Print />
            </IconButton>
          ) : null}
        </>
      ),
    },
  ]

  const rows2: GridRowsProp = foodsInOrder || []
  const columns2: GridColDef[] = [
    { field: 'id', headerName: 'Id', flex: 1, sortable: false },
    { field: 'name', headerName: 'Name', flex: 2, sortable: false },
    { field: 'cost', headerName: 'Unit Price', flex: 1, sortable: false },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return <Typography>{foodsQuantity[params.row.id]}</Typography>
      },
    },
  ]

  //handle
  const handleSelectionModelChange = async (newSelectionModel: any) => {
    setSelectedRowIds(newSelectionModel)

    const selectedRows = newSelectionModel.map((rowId: any) =>
      rows.find((row) => row.id === rowId)
    )
    const selectedRowIds = selectedRows.map((row: any) => row.id)

    //handle on select row
    let lastIdSelected: number = selectedRowIds[selectedRowIds.length - 1]
    if (!lastIdSelected) return
    let res = await fetchFoodsByOrderId(
      lastIdSelected.toString(),
      session!.user.token
    )
    let orderFoodRes = await fetchOrderFoodByOrderId(
      lastIdSelected.toString(),
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
  const handleStatusChangeSubmit = async (event: any) => {
    event.preventDefault()
    selectedRowIds.forEach(async (id: any) => {
      let res = await putOrderStatus(id, statusSelection, session!.user.token)
    })
    mutate('fetchOrders', () => fetchOrders(session!.user.token))
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
        <Box sx={{ width: '65%', pl: 1 }}>
          <Typography variant="h3" component="h1">
            Manage order table
          </Typography>
        </Box>
        <Box sx={{ width: '35%', pr: 1 }} display="flex" alignItems="center">
          <Typography variant="h5" component="h5">
            Order ID: {selectedRowIds[selectedRowIds.length - 1]}
          </Typography>
        </Box>
      </Box>
      <Box display="flex">
        <Box sx={{ width: '65%', pr: 1 }}>
          <DataGrid
            sx={{ bgcolor: theme.palette.background.paper }}
            rows={rows}
            columns={columns}
            style={{ height: '40em' }}
            checkboxSelection
            rowSelectionModel={selectedRowIds}
            onRowSelectionModelChange={handleSelectionModelChange}
            density="compact"
            disableColumnMenu
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
        <Box sx={{ width: '35%', pl: 1 }}>
          <DataGrid
            sx={{ bgcolor: theme.palette.background.paper }}
            rows={foodsInOrder}
            columns={columns2}
            style={{ height: '40em' }}
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
          />
        </Box>
      </Box>
    </>
  )
}

const handleClickPrint = async (
  row1: IOrder,
  foodsInOrder: any,
  foodsQuantity: any
) => {
  // const popup = window.open('/billPrint', 'newwindow', 'width=600,height=600')
  // await Promise.all([
  sessionStorage.setItem('row1', JSON.stringify(row1))
  sessionStorage.setItem('foodsInOrder', JSON.stringify(foodsInOrder))
  sessionStorage.setItem('foodsQuantity', JSON.stringify(foodsQuantity))
  console.log('row1', sessionStorage.getItem('row1')!)
  console.log('rows2', sessionStorage.getItem('foodsInOrder')!)
  console.log('foodsQuantity', sessionStorage.getItem('foodsQuantity')!)

  // ])

  // Open a new window
  window.open('/billPrint', '_blank', 'width=600,height=600')
}
