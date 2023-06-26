import { IStaff, IStaffCreate } from '@/models/models'
import {
  createStaff,
  deleteStaffById,
  getAllStaffs,
  updateStaff,
} from '@/services/adminApi'
import { Cancel, Delete, Edit, Save } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
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
  GridRowProps,
  GridToolbar,
} from '@mui/x-data-grid'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  FormContainer,
  TextFieldElement,
  AutocompleteElement,
} from 'react-hook-form-mui'
import useSWR, { mutate } from 'swr'

export default function StaffPage() {
  const { data: session } = useSession()
  const { data: staffs, error: e1 } = useSWR<IStaff[]>(
    session ? 'staffs' : null,
    () => getAllStaffs(session!.user.token)
  )

  // const [rows, setRows] = useState<GridRowsProp | IStaff[]>(staffs)
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [selectedRow, setSelectedRow] = useState<GridRowProps | IStaff>(
    null as any
  )
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<IStaffCreate>()

  useEffect(() => {
    console.log('values', values)
  }, [values])

  const defaultValues: IStaffCreate = {
    username: '',
    password: '',
    role: '',
    fullName: '',
    phoneNumber: '',
    citizenId: '',
  }

  const onFormSubmit = async (data: IStaffCreate) => {
    console.log('confirm add')
    setValues(data)
    try {
      const res = await createStaff(session!.user.token, data)
      console.log('res', res)
      setOpen(false)
      mutate('staffs')
    } catch (error) {
      alert('failed to add staff')
      console.log('error', error)
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirmAdd = async () => {
    console.log('confirm add')
    // try {
    //   // const res = await createStaff(session!.user.token, selectedRow as IStaffCreate)
    //   // console.log('res', res)
    //   // setRows(rows.filter((row) => row.id !== id));

    //   mutate('staffs')
    // } catch (error) {
    //   alert('failed to add staff')
    //   console.log('error', error)
    // }
    // setOpen(false)
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = { ...newRow } as IStaff
    console.log('row', updatedRow)
    try {
      const res = await updateStaff(session!.user.token, updatedRow)
      console.log('res', res)
    } catch (error) {
      alert('failed to update staff role')
      console.log('error', error)
    }
    return updatedRow
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })
  }

  const handleAddButton = async (row: IStaff) => {
    console.log('add')
  }

  const handleDeleteClick = (id: GridRowId) => async () => {
    console.log('delete')
    try {
      const res = await deleteStaffById(session!.user.token, +id)
      console.log('res', res)
      mutate('staffs')
    } catch (error) {
      alert('failed to delete staff')
      console.log('error', error)
    }
  }

  // const rows: GridRowsProp = staffs
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
    { field: 'citizenId', headerName: 'citizenId', width: 150, editable: true },
    { field: 'salary', headerName: 'salary', width: 150, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]
  if (!staffs) return <div>loading...</div>
  if (e1) return <div>failed to load staffs</div>

  return (
    <>
      <Typography variant="h3" textAlign="center">
        Staffs Management
      </Typography>
      <Box>
        <DataGrid
          rows={staffs!}
          columns={columns}
          sx={{
            bgcolor: 'background.paper',
            mt: 4,
            height: 600,
          }}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onCellDoubleClick={(_, event) => {
            event.defaultMuiPrevented = true
          }}
          disableColumnSelector
          disableDensitySelector
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              // setRows,
              // setRowModesModel,
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Box>

      {/* Add staff */}
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" sx={{ m: 2 }} onClick={handleClickOpen}>
          Add staff
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <FormContainer defaultValues={{}} onSuccess={onFormSubmit}>
            <DialogTitle>Add staff</DialogTitle>
            <DialogContent>
              <Stack direction={'column'}>
                <TextFieldElement
                  autoFocus
                  margin="dense"
                  id="username"
                  name="username"
                  label="Username"
                  type="text"
                  fullWidth
                  variant="standard"
                  required
                />
                <TextFieldElement
                  margin="dense"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="standard"
                  required
                />
                <AutocompleteElement
                  name="role"
                  label="Role"
                  options={['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']}
                  required
                  textFieldProps={{
                    margin: 'dense',
                    variant: 'standard',
                    type: 'text',
                    fullWidth: true,
                  }}
                />
                <TextFieldElement
                  margin="dense"
                  id="fullName"
                  name="fullName"
                  label="Full name"
                  type="text"
                  fullWidth
                  variant="standard"
                  required
                />
                <TextFieldElement
                  margin="dense"
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone number"
                  type="text"
                  fullWidth
                  variant="standard"
                />
                <TextFieldElement
                  margin="dense"
                  id="citizenId"
                  name="citizenId"
                  label="Citizen ID"
                  type="text"
                  fullWidth
                  variant="standard"
                />
                <br />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                // onClick={handleConfirmAdd}
                type="submit"
                variant="contained"
              >
                Add
              </Button>
            </DialogActions>
          </FormContainer>
        </Dialog>
      </Box>
    </>
  )
}
