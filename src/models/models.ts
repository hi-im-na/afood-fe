export interface IMenu {
  id: number
  name: string
  description: string
  dateUpdated: Date
}

export interface IFood {
  id: number
  name: string
  description: string
  cost: number
  image: string
  dateUpdated: Date
}

export interface ITableArea {
  id: number
  areaName: string
  areaDescription: string
}

export interface ITableRestaurant {
  id: number
  tableAreaId: number
  maxCapacity: number
  // servingStaffId: number
  tableStatus: string
}

export interface ITableSitting {
  id: number
  inTime: Date
  outTime: Date
  numPersonSitting: number
  tableRestaurantId: number
}

export interface IOrder {
  id: number
  orderInTime: Date
  orderOutTime: Date
  tableSittingId: number
  staffId: number
  orderStatus: string
  totalCost: number
}

export interface IOrderFood {
  id: number
  orderId: number
  foodId: number
  quantity: number
}

export interface IStaff {
  id: number
  username: string
  role: string
  fullName: string
  phoneNumber: string
  citizenId: string
  salary: number
}

export interface IStaffCreate {
  username: string
  password: string
  role: string
  fullName: string
  phoneNumber: string
  citizenId: string
}

export interface INgayCong {
  id: number
  timeWorked: number
  workedDate: Date
  staffId: number
}
