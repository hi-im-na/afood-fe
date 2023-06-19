import { IFood, IOrder } from '@/models/models'
import {
  fetchFoodsByOrderId,
  fetchOrderFoodByOrderId,
  fetchOrders,
  putOrderStatus,
} from '@/services/managerApi'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { useSession } from 'next-auth/react'

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import useSWR, { mutate } from 'swr'

export default function OrderPage() {
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
  const rows: GridRowsProp = orders || []

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 100 },
    { field: 'orderInTime', headerName: 'In Time', width: 200 },
    { field: 'orderOutTime', headerName: 'Out Time', width: 200 },
    { field: 'tableSittingId', headerName: 'Table', width: 50 },
    { field: 'staffId', headerName: 'Staff Id', width: 70 },
    { field: 'orderStatus', headerName: 'orderStatus', width: 150 },
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
    console.log('Selected Row IDs:', selectedRowIds)
  }
  const handleStatusChangeSubmit = async (event: any) => {
    event.preventDefault()
    selectedRowIds.forEach(async (id: any) => {
      let res = await putOrderStatus(id, statusSelection, session!.user.token)
      console.log(res)
    })
    mutate('fetchOrders', () => fetchOrders(session!.user.token))
  }

  const handleOnOrderIdChange = (event: any) => {
    setOrderId(event.target.value)
  }

  async function handleConfirmOrderShow(e: any) {
    e.preventDefault()
    console.log('show confirm order')
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

      console.log('orderFoodQuantities:', orderFoodQuantities)
      // setFoodsQuantity({ []: orderFoodQuantities[] })
      const result: { [key: string]: number } = orderFoodIds.reduce(
        (acc, orderFoodId, index) => {
          acc[orderFoodId] = orderFoodQuantities[index]
          return acc
        },
        {} as { [key: string]: number }
      )
      console.log(result)
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
              sx={{ bgcolor: 'white' }}
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
        <Box sx={{ width: '55%' }}>
          <Typography variant="h3" component="h1">
            Manage order table
          </Typography>
        </Box>
        <Box sx={{ width: '45%' }} display="flex" alignItems="center">
          <Typography variant="body1" component="h5">
            Choose the order you want to see:
          </Typography>
          <InputLabel id="orderId" />
          &nbsp;
          <TextField
            sx={{ bgcolor: 'white' }}
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
        <Box sx={{ width: '55%', pr: 1 }}>
          <DataGrid
            sx={{ bgcolor: 'white' }}
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
            }}
          />
          {ordersTable}
        </Box>
        <Box sx={{ width: '45%', pl: 1 }}>
          <DataGrid
            sx={{ bgcolor: 'white' }}
            rows={foodsInOrder}
            columns={columns2}
            style={{ height: 600 }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'asc' }],
              },
            }}
          />
          {/* {foodsInOrder.length > 0 ? (
            foodsInOrder.map((food) => (
              <>
                <Box>{food.name}</Box>
              </>
            ))
          ) : (
            <>cs cai nit</>
          )} */}
        </Box>
      </Box>
    </>
  )
}
