import { IFood, IOrder } from '@/models/models'
import { addFoodToOrder, addOrder } from '@/services/managerApi'
import { fetchFoods } from '@/services/publicApi'
import {
  Alert,
  Box,
  Button,
  InputLabel,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

interface AddOrderPageProps {
  foods: IFood[]
}

let addOrderTable
let addFoodToOrderTable

interface FoodsQuantity {
  [key: number]: number
}

interface FoodPrice {
  [key: number]: number
}
let foodsInMenus
export const getServerSideProps: GetServerSideProps = async () => {
  const foods = await fetchFoods()
  return { props: { foods } }
}

let row2paramId: number
let addedFoodsPrices: FoodPrice = {}
// let totalOrderPrice: number = 0
export default function AddOrderPage({ foods }: AddOrderPageProps) {
  const { data: session } = useSession()
  const [addedFoods, setAddedFoods] = useState<IFood[]>([])
  const [foodsQuantity, setFoodsQuantity] = useState<FoodsQuantity>({})
  const [totalOrderPrice, setTotalOrderPrice] = useState(0)
  const [isSnackbarOpen, setSnackbarOpen] = useState(false)
  const [isErrorSnackbarOpen, setErrorSnackbarOpen] = useState(false)
  const [isSuccessSnackbarOpen, setSuccessSnackbarOpen] = useState(false)
  //form data
  const [tableId, setTableId] = useState('')
  const [staffId, setStaffId] = useState('')

  useEffect(() => {
    // total order price
    addedFoodsPrices = {
      ...addedFoods.map((food) => food.cost * foodsQuantity[food.id]),
    }
    setTotalOrderPrice(
      Object.values(addedFoodsPrices).reduce((a, b) => a + b, 0)
    )

    //if foodsQuantity is empty, reset addedFoods
    if (foodsQuantity[row2paramId] < 1) {
      const newFoodsQuantity = { ...foodsQuantity }
      delete newFoodsQuantity[row2paramId]
      setFoodsQuantity(newFoodsQuantity)
      setAddedFoods((prevFoods) =>
        prevFoods.filter((food) => food.id != row2paramId)
      )
    }
  }, [foodsQuantity])
  useEffect(() => {
    console.log('addedFoods changed', addedFoods)
  }, [addedFoods])

  useEffect(() => {}, [isErrorSnackbarOpen])
  useEffect(() => {}, [isSuccessSnackbarOpen])

  // addOrder table definitions
  const rows: GridRowsProp = foods || []

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 50 },
    { field: 'name', headerName: 'Name', width: 400 },
    { field: 'cost', headerName: 'Cost ($)', width: 200 },
    {
      field: 'Add to order',
      headerName: 'Add to order',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation() // don't select this row after clicking
          const currentRow: IFood = params.row
          row2paramId = params.row.id

          // not add if already added
          if (addedFoods.includes(currentRow)) {
            return
          }
          setAddedFoods([...addedFoods, currentRow])
          setFoodsQuantity({ ...foodsQuantity, [currentRow.id]: 1 })
        }
        return <Button onClick={onClick}>Add to order</Button>
      },
    },
  ]

  // order info table definitions
  const columns2: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 10 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'cost', headerName: 'Cost ($)', width: 100 },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 75,
      sortable: false,
      renderCell: (params) => {
        let foodQuantity = foodsQuantity[params.row.id]

        return <Typography>{foodQuantity ? foodQuantity : 1}</Typography>
      },
    },
    {
      field: '-',
      headerName: '-',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation() // don't select this row after clicking
          row2paramId = params.row.id
          // TODO: quantity
          let foodQuantity = foodsQuantity[params.row.id]
          setFoodsQuantity({
            ...foodsQuantity,
            [params.row.id]: foodQuantity - 1,
          })
        }
        return <Button onClick={onClick}>Remove</Button>
      },
    },
    {
      field: '+',
      headerName: '+',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation() // don't select this row after clicking
          row2paramId = params.row.id
          // TODO: quantity
          let foodQuantity = foodsQuantity[params.row.id]
          if (foodQuantity === undefined) {
            foodQuantity = 1
          }
          let newQuantity = foodQuantity + 1
          setFoodsQuantity({
            ...foodsQuantity,
            [params.row.id]: newQuantity,
          })
        }
        return <Button onClick={onClick}>Add</Button>
      },
    },
  ]

  //handle

  addOrderTable = (
    <>
      <Box sx={{ width: '60%', pr: 1 }}>
        <DataGrid
          sx={{ bgcolor: 'white' }}
          rows={rows}
          columns={columns}
          style={{ height: 600 }}
          disableRowSelectionOnClick
        />
      </Box>
    </>
  )

  addFoodToOrderTable = (
    <>
      <Box sx={{ width: '40%', pl: 1 }}>
        <DataGrid
          sx={{ bgcolor: 'white' }}
          rows={addedFoods}
          columns={columns2}
          style={{ height: 600 }}
          disableRowSelectionOnClick
        />
      </Box>
    </>
  )

  //handle form data
  async function handleConfirmAddOrder(
    e: MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault()
    try {
      //add new order
      let newOrder: IOrder = await addOrder(
        staffId,
        tableId,
        session!.user.token
      )

      //add foods to order
      addedFoods.forEach(async (food) => {
        let res = await addFoodToOrder(
          newOrder?.id.toString(),
          food.id.toString(),
          foodsQuantity[food.id].toString(),
          session!.user.token
        )
        if (res) {
          console.log('added food to order', res)
        } else {
          throw 'add food to order failed'
        }
      })
      setSnackbarOpen(true)
      setSuccessSnackbarOpen(true)
    } catch (err) {
      console.log(err)
      setSnackbarOpen(false)
      setErrorSnackbarOpen(true)
    }
  }
  const handleOnStaffIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('staffId', e.target.value)
    setStaffId(e.target.value)
  }
  const handleOnTableIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTableId(e.target.value)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    setSuccessSnackbarOpen(false)
    setErrorSnackbarOpen(false)
  }
  return (
    <>
      <Box display="flex">
        <Box sx={{ width: '60%' }}>
          <Typography variant="h4" component="h4">
            Menu
          </Typography>
        </Box>
        <Box sx={{ width: '40%' }}>
          <Typography variant="h4" component="h4">
            Added food
          </Typography>
        </Box>
      </Box>
      <Box display="flex">
        {addOrderTable}
        {addFoodToOrderTable}
      </Box>
      {/* status div */}
      <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
        <Box
          sx={{ width: '60%' }}
          display="flex"
          justifyContent="space-around"
          alignItems="center"
        >
          <Typography variant="h6" component="span">
            Confirm add new order:
          </Typography>
          <InputLabel id="staffId" />
          <TextField
            sx={{ bgcolor: 'white' }}
            label="staffId"
            id="staff-id"
            value={staffId}
            onChange={handleOnStaffIdChange}
          />

          {/* TODO: TableId */}
          <InputLabel id="tableId" />
          <TextField
            sx={{ bgcolor: 'white' }}
            label="tableId"
            id="table-id"
            value={tableId}
            onChange={handleOnTableIdChange}
          />

          <Button
            type="submit"
            variant="contained"
            onClick={(e: any) => handleConfirmAddOrder(e)}
          >
            Submit
          </Button>
        </Box>
        <Box display="flex" justifyContent="flex-end" sx={{ width: '40%' }}>
          <Typography variant="h3">
            Total price: {totalOrderPrice}
            {'$'}
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          severity={
            isSuccessSnackbarOpen
              ? 'success'
              : isErrorSnackbarOpen
              ? 'error'
              : 'info'
          }
          sx={{ width: '100%' }}
        >
          {isSuccessSnackbarOpen
            ? 'success'
            : isErrorSnackbarOpen
            ? 'There is something wrong!. Check the log for more information'
            : 'info'}
        </Alert>
      </Snackbar>
    </>
  )
}
