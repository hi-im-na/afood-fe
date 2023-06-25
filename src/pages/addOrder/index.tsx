import { IFood, IOrder } from '@/models/models'
import { addFoodToOrder, addOrder } from '@/services/managerApi'
import { fetchFoods } from '@/services/publicApi'
import { Add, Remove } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputLabel,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid'
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
  const theme = useTheme()
  const { data: session } = useSession()
  const [addedFoods, setAddedFoods] = useState<IFood[]>([])
  const [foodsQuantity, setFoodsQuantity] = useState<FoodsQuantity>({})
  const [totalOrderPrice, setTotalOrderPrice] = useState(0)
  const [isSnackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarColor, setSnackbarColor] = useState('')

  //form data
  const [tableId, setTableId] = useState('')
  // const [staffId, setStaffId] = useState('')

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

  useEffect(() => {
    if (isSnackbarOpen === false) setSnackbarColor('')
  }, [isSnackbarOpen])
  // addOrder table definitions
  const rows: GridRowsProp = foods || []

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 2, sortable: false },
    { field: 'cost', headerName: 'Cost ($)', flex: 1, sortable: false },
    {
      field: 'Add to order',
      headerName: 'Add to order',
      sortable: false,
      flex: 1,
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
        return <Button onClick={onClick}>Add</Button>
      },
    },
  ]

  // order info table definitions
  const columns2: GridColDef[] = [
    { field: 'id', headerName: 'Id', flex: 2 },
    { field: 'name', headerName: 'Name', flex: 4 , sortable: false,},
    { field: 'cost', headerName: 'Cost ($)', flex: 2 , sortable: false,},
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        let foodQuantity = foodsQuantity[params.row.id]

        return <Typography>{foodQuantity ? foodQuantity : 1}</Typography>
      },
    },
    {
      field: '-',
      headerName: '-',
      flex: 1,
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
        return (
          <IconButton onClick={onClick} size='small'>
            <Remove fontSize='small'/>
          </IconButton>
        )
        // <Button onClick={onClick}>Remove</Button>
      },
    },
    {
      field: '+',
      headerName: '+',
      flex: 1,
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
        return (
          <IconButton onClick={onClick} size='small'>
            <Add fontSize='small' />
          </IconButton>
        )
        // <Button onClick={onClick}>Add</Button>
      },
    },
  ]

  //handle

  addOrderTable = (
    <>
      <Box sx={{ width: '55%', pr: 1 }}>
        <DataGrid
          sx={{ bgcolor: theme.palette.background.paper }}
          rows={rows}
          columns={columns}
          style={{ height: 600 }}
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 200 },
            },
          }}
        />
      </Box>
    </>
  )

  addFoodToOrderTable = (
    <>
      <Box sx={{ width: '45%', pl: 1 }}>
        <DataGrid
          sx={{ bgcolor: theme.palette.background.paper }}
          rows={addedFoods}
          columns={columns2}
          style={{ height: 600 }}
          disableRowSelectionOnClick
          disableColumnMenu
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
        session!.user.id.toString(),
        tableId,
        totalOrderPrice.toString(),
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
      setSnackbarColor('success')
    } catch (err) {
      console.log(err)
      setSnackbarOpen(true)
      setSnackbarColor('error')
    }
  }
  // const handleOnStaffIdChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   console.log('staffId', e.target.value)
  //   setStaffId(e.target.value)
  // }
  const handleOnTableIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTableId(e.target.value)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
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
      <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
        <Box
          sx={{ width: '55%' }}
          display="flex"
          justifyContent="space-around"
          alignItems="center"
        >
          <Typography variant="h6" component="span">
            Confirm add new order to table:
          </Typography>
          {/* <InputLabel id="staffId" />
          <TextField
            sx={{ bgcolor: theme.palette.background.paper, width: '20%' }}
            label="staffId"
            id="staff-id"
            value={staffId}
            onChange={handleOnStaffIdChange}
          /> */}

          <InputLabel id="tableId" />
          <TextField
            sx={{ bgcolor: theme.palette.background.paper, width: '20%' }}
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
        <Box display="flex" justifyContent="flex-end" sx={{ width: '45%' }}>
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
          severity={(snackbarColor ? snackbarColor : 'info') as any}
          sx={{ width: '100%' }}
        >
          {(snackbarColor ? snackbarColor : 'info') as string}
        </Alert>
      </Snackbar>
    </>
  )
}
