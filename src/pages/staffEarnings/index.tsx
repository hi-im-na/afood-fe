import PageTitle from '@/components/PageTitle/PageTitle'
import { IOrder, IStaff } from '@/models/models'
import { getAllStaffs } from '@/services/adminApi'
import { fetchOrders } from '@/services/managerApi'
import { Remove } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridToolbar,
} from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers'
import BigNumber from 'bignumber.js'
import dayjs, { Dayjs } from 'dayjs'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function StaffEarnings() {
  const { data: session } = useSession()

  const { data: staffs, error: staffsError } = useSWR<IStaff[]>(
    session ? '/api/admin/staffs' : null,
    () => getAllStaffs(session!.user.token)
  )

  const { data: orders, error: ordersError } = useSWR<IOrder[]>(
    session ? '/api/admin/orders' : null,
    () => fetchOrders(session!.user.token)
  )

  const [fromDate, setFromDate] = useState<Dayjs | null>(
    dayjs(new Date()).add(-1, 'month')
  )
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs(new Date()))
  const [selectedStaffIds, setSelectedStaffIds] =
    useState<GridRowSelectionModel>([])
  const [totalEarningsOfSelectedStaffs, setTotalEarningsOfSelectedStaffs] =
    useState<number>(0)

  useEffect(() => {
    // console.log('fromDate', fromDate)
  }, [fromDate])

  useEffect(() => {
    // console.log('toDate', toDate)
  }, [toDate])
  useEffect(() => {
    // console.log('rowSelectionModel', selectedStaffIds)
    handleOnSelectedChanged()
  }, [selectedStaffIds])

  useEffect(() => {
    // console.log('totalEarningsOfSelectedStaffs', totalEarningsOfSelectedStaffs)
  }, [totalEarningsOfSelectedStaffs])

  if (!staffs) return <div>loading staffs...</div>
  if (!orders) return <div>loading orders...</div>
  // ------------------------------logic---------------------------------

  // TODO: Tính tổng doanh thu của các nhân viên được chọn
  // TODO: Vẽ biểu đồ doanh thu của các nhân viên được chọn so với tổng doanh thu của nhà hàng

  /**
   * Tính tổng doanh thu của các nhân viên được chọn
   * @returns tổng doanh thu của các nhân viên được chọn (all time)
   */
  function totalEarningsAllTimeOfSelectedStaffs(): number {
    const totalEarningsOfSelectedStaffs = selectedStaffIds
      .map((staffId) => getStaffEarningsAllTimeByStaffId(+staffId))
      .reduce((a, b) => a + b, 0)
    return totalEarningsOfSelectedStaffs
  }

  function getAllOrderByStaffId(staffId: number): IOrder[] {
    return orders!.filter((order) => order.staffId === staffId)
  }

  function handleOnSelectedChanged() {
    const value = totalEarningsOfListStaffsInTimeRange()
    setTotalEarningsOfSelectedStaffs(value)
  }

  /**
   * Tính doanh thu của các nhân viên được chọn trong khoảng thời gian
   * @returns tổng doanh thu của các nhân viên được chọn trong khoảng thời gian
   */
  function totalEarningsOfListStaffsInTimeRange(): number {
    const totalEarningsOfListStaffsInTimeRange = selectedStaffIds
      .map((staffId) => getStaffEarningsInTimeRangeByStaffId(+staffId))
      .reduce((a, b) => a.plus(BigNumber(b)), BigNumber(0))
    return totalEarningsOfListStaffsInTimeRange.toNumber()
  }

  /**
   * tìm tất cả các đơn hàng của nhân viên có trạng thái PAID
   * và trả về tổng doanh thu của nhân viên đó
   * @param staffId
   * @returns tổng doanh thu của nhân viên (all time)
   */
  function getStaffEarningsAllTimeByStaffId(staffId: number): number {
    const staffOrders = getAllOrderByStaffId(staffId)
    const staffEarningsAllTime = staffOrders
      .map((order) => {
        if (order.orderStatus === 'PAID') return new BigNumber(order.totalCost)
        return BigNumber(0)
      })
      .reduce((a, b) => a.plus(b), BigNumber(0))
    return staffEarningsAllTime.toNumber()
  }
  /**
   * lấy doanh thu của nhân viên trong tháng hiện tại
   * @param staffOrders các đơn hàng của nhân viên
   * @returns doanh thu của nhân viên trong tháng hiện tại
   */
  function getStaffEarningsInMonth(staffOrders: IOrder[]): number {
    const ordersInMonth = staffOrders!.filter((order) => {
      const orderMonth = new Date(order.orderOutTime).getMonth() + 1
      const orderYear = new Date(order.orderOutTime).getFullYear()
      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()
      if (
        orderMonth === currentMonth &&
        orderYear === currentYear &&
        order.orderStatus === 'PAID'
      )
        return order
    })

    const staffEarningsInMonth = ordersInMonth
      .map((order) => new BigNumber(order.totalCost))
      .reduce((a, b) => a.plus(b), BigNumber(0))
    return staffEarningsInMonth.toNumber()
  }

  /**
   * lấy doanh thu của nhân viên trong tháng hiện tại
   *
   * Dùng hàm này chứ không phải hàm getStaffEarningsInMonth vì id tiện hơn
   * @param staffId Id của nhân viên cần lấy doanh thu
   * @returns doanh thu của nhân viên trong tháng hiện tại
   */
  function getStaffEarningsInMonthByStaffId(staffId: number): number {
    const staffOrders = getAllOrderByStaffId(staffId)
    return getStaffEarningsInMonth(staffOrders)
  }

  /**
   * lấy doanh thu của nhân viên trong khoảng thời gian fromDate đến toDate
   *
   * Nên dùng hàm getStaff
   * @param staffOrders các đơn hàng của nhân viên
   * @returns doanh thu của nhân viên trong khoảng thời gian
   */
  function getStaffEarningsInTimeRange(staffOrders: IOrder[]): number {
    const ordersInTimeRange = staffOrders!.filter((order) => {
      const orderDate = dayjs(new Date(order.orderOutTime))
      if (
        orderDate >= fromDate! &&
        orderDate <= toDate! &&
        order.orderStatus === 'PAID'
      )
        return order
    })

    const staffEarningsInTimeRange = ordersInTimeRange
      .map((order) => new BigNumber(order.totalCost))
      .reduce((a, b) => a.plus(b), BigNumber(0))
    return staffEarningsInTimeRange.toNumber()
  }

  /**
   * lấy doanh thu của nhân viên trong khoảng thời gian fromDate đến toDate
   *
   * Dùng hàm này chứ không phải hàm getStaffEarningsInTimeRange vì id tiện hơn
   * @param staffId Id của nhân viên cần lấy doanh thu
   * @returns doanh thu của nhân viên trong khoảng thời gian
   */
  function getStaffEarningsInTimeRangeByStaffId(staffId: number): number {
    const staffOrders = getAllOrderByStaffId(staffId)
    return getStaffEarningsInTimeRange(staffOrders)
  }

  let myRows = staffs.map((staff) => {
    return {
      id: staff.id,
      username: staff.username,
      role: staff.role,
      fullName: staff.fullName,
      totalEarningsInMonth: getStaffEarningsInMonthByStaffId(staff.id),
      totalEarningsAllTime: getStaffEarningsAllTimeByStaffId(staff.id),
      totalEarningsInTimeRange: getStaffEarningsInTimeRangeByStaffId(staff.id),
    }
  })

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', flex: 1 },
    { field: 'username', headerName: 'Username', flex: 2 },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      renderCell: (params) => {
        return params.row.role.slice(5)
      },
      editable: true,
    },
    { field: 'fullName', headerName: 'Full name', flex: 2 },
    {
      field: 'totalEarningsInMonth',
      headerName: 'Recent month',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'totalEarningsAllTime',
      headerName: 'All Time',
      flex: 2,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'totalEarningsInTimeRange',
      headerName: 'In Time Range ',
      flex: 2,
      align: 'center',
      headerAlign: 'center',
    },
  ]

  // ------------------------------ end logic----------------------------
  if (staffsError) return <div>failed to load staffs</div>
  if (ordersError) return <div>failed to load orders</div>

  return (
    <Box>
      <>
        <PageTitle title="Staff Earnings" />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'background.default',
            p: 2,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <Typography variant="h6" sx={{mb: 1}}>Time Range: </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'background.default',
            }}
          >
            <DatePicker
              sx={{ bgcolor: 'background.paper' }}
              label="From"
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              views={['month', 'year']}
            />
            <Remove />
            <DatePicker
              sx={{ bgcolor: 'background.paper' }}
              label="To"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              views={['month', 'year']}
            />
          </Box>
        </Box>
        <DataGrid
          columns={columns}
          rows={myRows}
          sx={{
            bgcolor: 'background.paper',
            height: '40em',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          checkboxSelection
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          disableDensitySelector
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setSelectedStaffIds(newRowSelectionModel)
          }}
          rowSelectionModel={selectedStaffIds}
          experimentalFeatures={{ columnGrouping: true }}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: { showQuickFilter: true },
          }}
          columnGroupingModel={[
            {
              groupId: "Staff's Information",
              // headerAlign: 'center',
              children: [
                { field: 'id' },
                { field: 'username' },
                { field: 'role' },
                { field: 'fullName' },
              ],
              renderHeaderGroup(params) {
                return (
                  <>
                    <Typography
                      variant="body2"
                      component={'span'}
                      sx={{ mr: 1 }}
                    >
                      Total earnings of selected staffs in <b>time range</b>:
                    </Typography>
                    <Typography variant="h5" component={'span'}>
                      {` ${totalEarningsOfSelectedStaffs}$`}
                      {}
                    </Typography>
                  </>
                )
              },
            },
            {
              groupId: 'Total Earnings of Staff ($)',
              children: [
                { field: 'totalEarningsInMonth' },
                { field: 'totalEarningsAllTime' },
                { field: 'totalEarningsInTimeRange' },
              ],
              headerAlign: 'center',
            },
          ]}
        />
      </>
    </Box>
  )
}
