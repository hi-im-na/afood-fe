import PageTitle from '@/components/PageTitle/PageTitle'
import { INgayCong, IStaff } from '@/models/models'
import { getAllNgayCong, getAllStaffs } from '@/services/adminApi'
import { Box, Grid } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid'
import BigNumber from 'bignumber.js'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

interface IRows {
  id: string
  username: string
  fullName: string
  month: number
  year: number
  salary: number
  totalTimeWorked: number
  totalSalary: number
}

export default function SeniorityPage() {
  const { data: session } = useSession()
  const { data: staffs, error: e1 } = useSWR<IStaff[]>(
    session ? 'staffs' : null,
    () => getAllStaffs(session!.user.token)
  )

  const { data: listNgayCong, error: e3 } = useSWR<INgayCong[]>(
    session ? 'listNgayCong' : null,
    () => getAllNgayCong(session!.user.token)
  )

  let myRows: any = []

  if (staffs && listNgayCong) {
    myRows = staffs.map((staff) => {
      const allNgayCongOfStaff: INgayCong[] = listNgayCong.filter(
        (ngayCong) => ngayCong.staffId === staff.id
      )
      // so thang da lam viec
      const totalMonthsWorked = allNgayCongOfStaff
        .filter((ngayCong) => ngayCong.staffId === staff.id)
        .map((ngayCong) => new Date(ngayCong.workedDate).getMonth())
        .reduce((a, b) => a + b, 0)

      // so nam da lam viec (unique)
      const uniqueYearsSet = new Set(
        allNgayCongOfStaff
          .filter((ngayCong) => ngayCong.staffId === staff.id)
          .map((ngayCong) => new Date(ngayCong.workedDate).getFullYear())
      )
      const totalYearsWorked = uniqueYearsSet.size

      // tong so gio lam viec
      const totalHoursWorked = allNgayCongOfStaff
        .filter((ngayCong) => ngayCong.staffId === staff.id)
        .map((ngayCong) => new BigNumber(ngayCong.timeWorked))
        .reduce((a, b) => a.plus(b).decimalPlaces(2), new BigNumber(0))

      return {
        ...staff,
        totalMonth: totalMonthsWorked,
        totalYear: totalYearsWorked,
        totalTimeWorked: totalHoursWorked,
      }
    })
  }

  const rows: GridRowsProp | IRows[] = myRows

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', flex: 1 },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'fullName', headerName: 'FullName', flex: 1 },
    { field: 'totalMonth', headerName: 'Total Month', flex: 1 },
    // { field: 'totalYear', headerName: 'Total Year', flex: 1 },
    { field: 'totalTimeWorked', headerName: 'Total Time Worked', flex: 1 },
  ]

  if (e1) return <div>failed to load e1</div>
  if (e3) return <div>failed to load e3</div>

  return (
    <>
      <Box>
        <PageTitle title="Staff's seniority" />

        <DataGrid
          rows={rows}
          columns={columns}
          sx={{ bgcolor: 'background.paper' }}
          style={{ height: '45em' }}
          checkboxSelection
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          disableDensitySelector
          // density="compact"
          initialState={{
            sorting: {
              sortModel: [{ field: 'totalTimeWorked', sort: 'desc' }],
            },
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: { showQuickFilter: true },
          }}
        />
        {/* </Box> */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}></Grid>
        </Grid>
      </Box>
    </>
  )
}
