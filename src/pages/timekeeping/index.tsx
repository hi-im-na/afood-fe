import PageTitle from '@/components/PageTitle/PageTitle'
import { INgayCong, IStaff } from '@/models/models'
import {
  createNgayCong,
  deleteNgayCong,
  getAllNgayCong,
  getAllStaffs,
  getNgayCongByStaffId,
  updateStaffSalaryById,
} from '@/services/adminApi'
import { Add, EditCalendar, Remove } from '@mui/icons-material'
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
import BigNumber from 'bignumber.js'
import dayjs, { Dayjs } from 'dayjs'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import useSWR, { mutate } from 'swr'

export default function TimekeepingPage() {
  const { data: session } = useSession()
  const { data: staffs, error: e1 } = useSWR<IStaff[]>(
    session ? 'staffs' : null,
    () => getAllStaffs(session!.user.token)
  )
  const { data: listAllNgayCong, error: e2 } = useSWR<INgayCong[]>(
    session ? 'listAllNgayCong' : null,
    () => getAllNgayCong(session!.user.token)
  )
  const [listNgayCong, setListNgayCong] = useState<INgayCong[]>([])
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

  useEffect(() => {}, [listNgayCong])

  useEffect(() => {}, [dateVal])

  const handleClickOpen = () => {
    setOpen(true)
    // setScroll(scrollType)
  }
  const handleClose = () => {
    setOpen(false)
    setListNgayCong([])
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
      setListNgayCong([...listNgayCong, res])
      setOpenAddTimekeeping(false)
      mutate('listAllNgayCong')
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

  if (staffs === undefined) return <div>Loading...</div>
  if (listAllNgayCong === undefined) return <div>Loading...</div>
  // --------------- bắt đầu tính toán sau khi đã có dữ liệu ----------------

  /**
   * tính toán số ngày làm việc của mỗi nhân viên trong tháng hiện tại
   * và gán vào myRows: (IStaff & { totalDaysWorked: number })[]
   */
  const myRows = staffs.map((staff) => {
    const uniqueDaysWorked = [
      ...new Set(
        listAllNgayCong
          .filter((ngayCong) => ngayCong.staffId === staff.id)
          .flatMap((ngayCong) => ngayCong.workedDate)
          .filter((date) => new Date(date).getMonth() === new Date().getMonth()) // Filter by current month
      ),
    ]

    const totalHoursInMonth = listAllNgayCong.reduce((total, ngayCong) => {
      if (
        ngayCong.staffId === staff.id &&
        new Date(ngayCong.workedDate).getMonth() === new Date().getMonth()
      ) {
        return total + ngayCong.timeWorked
      }
      return total
    }, 0)

    const totalSalaryInMonth = BigNumber(totalHoursInMonth)
      .times(staff.salary)
      .toNumber()

    return {
      ...staff,
      totalDaysWorkedInMonth: uniqueDaysWorked.length,
      totalHoursInMonth: totalHoursInMonth,
      totalSalaryInMonth: totalSalaryInMonth,
    }
  })

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  /**
   * Chả biêt để làm cái đéo gì, có lẽ không cần thiết
   * @param newRow
   * @returns
   */
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
      const res = await getNgayCongByStaffId(session!.user.token, row.id!)
      console.log('ngay cong', res)
      setListNgayCong(res)
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
      setListNgayCong([...listNgayCong.filter((item) => item.id !== id)])
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
    {
      field: 'totalSalaryInMonth',
      headerName: 'Salary(month)',
      flex: 1,
      align: 'center',
    },
    {
      field: 'totalHoursInMonth',
      headerName: 'Hours (month)',
      flex: 1,
      align: 'center',
    },
    {
      field: 'totalDaysWorkedInMonth',
      headerName: 'Days worked (month)',
      flex: 1.2,
      align: 'center',
    },
    {
      field: 'timekeeping',
      type: 'actions',
      headerName: 'timekeeping',
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

  // if (!staffs) return <div>loading...</div>
  // if (e1) return <div>failed to load staffs</div>
  if (e1 || e2) return <div>Error</div>

  return (
    <>
      <Box>
        <PageTitle title="Timekeeping" />
        <DataGrid
          rows={myRows}
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
                {listNgayCong.length > 0 ? (
                  listNgayCong.map((ngay) => {
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
