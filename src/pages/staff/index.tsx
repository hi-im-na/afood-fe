import { IStaff } from '@/models/models'
import { getAllStaffs } from '@/services/adminApi'
import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material'
import { Button, Grid, Typography } from '@mui/material'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbar,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useSWR from 'swr'

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
}

// function EditToolbar(props: EditToolbarProps) {
//   const { setRows, setRowModesModel } = props

//   const handleClick = () => {
//     const id = randomId()
//     setRows((oldRows) => [...oldRows, { isNew: true }])
//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
//     }))
//   }

//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<Add />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   )
// }

export default function StaffPage() {
  const { data: session } = useSession()

  const { data: staffs, error: e1 } = useSWR<IStaff[]>(
    session ? 'staffs' : null,
    () => getAllStaffs(session!.user.token)
  )
  if (!staffs) return <div>loading...</div>
  if (e1) return <div>failed to load staffs</div>

  const rows: GridRowsProp = staffs
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 150 },
    { field: 'username', headerName: 'Username', width: 150 },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params) => {
        return params.row.role.slice(5)
      },
      editable: true,
    },
    { field: 'fullName', headerName: 'Full name', width: 150, editable: true },
    {
      field: 'phoneNumber',
      headerName: 'phoneNumber',
      width: 150,
      editable: true,
    },
    { field: 'citizenId', headerName: 'cityzenId', width: 150, editable: true },
    { field: 'salary', headerName: 'salary', width: 150, editable: true },
  ]

  return (
    <>
      <Typography variant="h3" textAlign="center">
        Staffs Management
      </Typography>
      <Grid container spacing={2}>
        <DataGrid
          rows={rows}
          columns={columns}
          sx={{
            bgcolor: 'background.paper',
            mt: 4,
            height: 600,
          }}
          editMode="row"
          disableColumnSelector
          disableDensitySelector
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Grid>
    </>
  )
}
