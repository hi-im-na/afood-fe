import { INgayCong, IStaff } from '@/models/models'
import {
  createNgayCong,
  deleteNgayCong,
  getAllStaffs,
  getNgayCong,
  updateStaffSalaryById,
} from '@/services/adminApi'
import {
  Add,
  EditCalendar,
  Remove
} from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
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
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

export default function TimekeepingPage() {
  const { data: session } = useSession()
  const { data: staffs, error: e1 } = useSWR<IStaff[]>(
    session ? 'staffs' : null,
    () => getAllStaffs(session!.user.token)
  )
  //   const {data: ngayCongs, error: e2} = useSWR<INgayCong[]>(session ? 'ngayCong' : null, () => getNgayCongs(session!.user.token))
  const [ngayCong, setNgayCong] = useState<INgayCong[]>([])
  const [open, setOpen] = useState(false)
  const [openAddTimekeeping, setOpenAddTimekeeping] = useState(false)
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [selectedRow, setSelectedRow] = useState<GridRowProps | IStaff>(
    null as any
  )
  const [dateVal, setDateVal] = useState<Dayjs | null>(dayjs(new Date()))
  const [timeVal, setTimeVal] = useState<number>(0)

  const descriptionElementRef = useRef<HTMLElement>(null)
  const descriptionElementRef2 = useRef<HTMLElement>(null)

  useEffect(() => {

  }, [ngayCong])

  useEffect(() => {
    
  }, [dateVal])

  const handleClickOpen = () => {
    setOpen(true)
    // setScroll(scrollType)
  }
  const handleClose = () => {
    setOpen(false)
    setNgayCong([])
  }

  const handleAddTimekeepingClickOpen = () => {
    setOpenAddTimekeeping(true)
  }
  const handleCancelAddTimekeeping = () => {
    setOpenAddTimekeeping(false)
    setDateVal(dayjs(new Date()))
    setTimeVal(0)
  }

  const handleConfirmAddTimekeeping = async () => {
    console.log('confirm add timekeeping')
    try {
      const res = await createNgayCong(
        session!.user.token,
        selectedRow.id!.toString(),
        dateVal!.toDate(),
        timeVal
      )
      setNgayCong([...ngayCong, res])
      setOpenAddTimekeeping(false)
    } catch (e: any) {
      alert(e.response.data)
      console.log(e)
    }
  }

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = { ...newRow }
    console.log('row', updatedRow)
    const res = await updateStaffSalaryById(
      session!.user.token,
      updatedRow.id,
      updatedRow.salary
    )
    if (res) {
    } else {
      alert('failed to update staff role')
      throw new Error('failed to update staff role')
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

  const handleTimekeepingClick = (row: GridRowProps) => async () => {
    console.log('timekeeping', row)
    try {
      const res = await getNgayCong(session!.user.token, row.id!)
      console.log('ngay cong', res)
      setNgayCong(res)
    } catch (e: any) {
      // alert(e.response.data)
      console.log(e)
    }
    setSelectedRow(row)
    setOpen(true)
  }

  const handleAddButton = async (row: IStaff) => {
    console.log('add')
    setOpenAddTimekeeping(true)
  }
  const handleRemove = async (id: number) => {
    console.log('remove')
    try {
      const res = await deleteNgayCong(session!.user.token, id)
      setNgayCong([...ngayCong.filter((item) => item.id !== id)])
      console.log('res ', res)
    } catch (e: any) {
      alert(e.response.data)
      console.log(e)
    }
  }
  // const rows: GridRowsProp = staffs
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', flex: 1 },
    { field: 'username', headerName: 'Username', flex: 2 },
    { field: 'fullName', headerName: 'Full name', flex: 2 },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      renderCell: (params) => {
        return params.row.role.slice(5)
      },
    },
    // { field: 'salary', headerName: 'Salary($)/hour', editable: true, flex: 1 },
    // {
    //   field: 'actions',
    //   type: 'actions',
    //   headerName: 'Actions',
    //   cellClassName: 'actions',
    //   flex: 1,
    //   getActions: ({ id }) => {
    //     const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

    //     if (isInEditMode) {
    //       return [
    //         <GridActionsCellItem
    //           icon={<Save />}
    //           label="Save"
    //           sx={{
    //             color: 'primary.main',
    //           }}
    //           onClick={handleSaveClick(id)}
    //         />,
    //         <GridActionsCellItem
    //           icon={<Cancel />}
    //           label="Cancel"
    //           className="textPrimary"
    //           onClick={handleCancelClick(id)}
    //           color="inherit"
    //         />,
    //       ]
    //     }

    //     return [
    //       <GridActionsCellItem
    //         icon={<Edit />}
    //         label="Edit"
    //         className="textPrimary"
    //         onClick={handleEditClick(id)}
    //         color="inherit"
    //       />,
    //     ]
    //   },
    // },
    {
      field: 'timekeeping',
      type: 'actions',
      headerName: 'timekeeping',
      // width: 120,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <GridActionsCellItem
              icon={<EditCalendar />}
              label="Timekeeping"
              sx={{ color: 'text.primary' }}
              onClick={handleTimekeepingClick(params.row)}
            />
          </>
        )
      },
    },
  ]

  if (!staffs) return <div>loading...</div>
  if (e1) return <div>failed to load staffs</div>
  return (
    <>
      <Box>
        <Typography variant="h3" textAlign="center">
          Timekeeping
        </Typography>
        <DataGrid
          rows={staffs}
          columns={columns}
          sx={{
            bgcolor: 'background.paper',
            mt: 4,
            height: 600,
          }}
          editMode="cell"
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
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />

        {/* dialog open staff's timekeeping */}
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={'paper'}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth
          maxWidth="sm"
        >
          <Box display="flex" justifyContent="space-between" sx={{ px: 3 }}>
            <DialogTitle id="scroll-dialog-title">
              {selectedRow?.username}
            </DialogTitle>
            <Box display="flex" alignItems="center">
              <Button
                onClick={() => handleAddButton(selectedRow as IStaff)}
                startIcon={<Add />}
                color="primary"
                variant="contained"
              >
                Add
              </Button>
            </Box>
          </Box>

          <DialogContent dividers={true}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Grid container textAlign={'center'}>
                <Grid item xs={1} fontWeight={'bold'}>
                  id
                </Grid>
                <Grid item xs={5} fontWeight={'bold'}>
                  Worked Dates
                </Grid>
                <Grid item xs={4} fontWeight={'bold'}>
                  Time worked in day
                </Grid>
                <Grid item xs={2} fontWeight={'bold'}>
                  Remove
                </Grid>
                {ngayCong.length > 0 ? (
                  ngayCong.map((ngay) => {
                    return (
                      <>
                        <Grid item xs={1}>
                          {ngay.id}
                        </Grid>
                        <Grid item xs={5}>
                          {new Date(ngay.workedDate).toDateString()}
                        </Grid>
                        <Grid item xs={4}>
                          {ngay.timeWorked}
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton onClick={() => handleRemove(ngay.id)}>
                            <Remove />
                          </IconButton>
                        </Grid>
                      </>
                    )
                  })
                ) : (
                  <>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      {`------------------No data------------------`}
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* dialog add timekeeping */}
        <Dialog
          open={openAddTimekeeping}
          onClose={handleCancelAddTimekeeping}
          scroll={'paper'}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="scroll-dialog-title" textAlign="center">
            Add timekeeping
          </DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef2}
              tabIndex={-1}
            >
              <Grid container textAlign={'center'}>
                <Grid item xs={6} fontWeight={'bold'}>
                  Date
                </Grid>
                <Grid item xs={6} fontWeight={'bold'}>
                  Time worked in day (hours)
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    value={dateVal}
                    onChange={(value) => {
                      setDateVal(value)
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  {/* <TimeField /> */}
                  <TextField
                    placeholder="Hours"
                    value={timeVal}
                    onChange={(event) => {
                      setTimeVal(event.target.value as any)
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="success"
              onClick={handleConfirmAddTimekeeping}
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancelAddTimekeeping}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}
