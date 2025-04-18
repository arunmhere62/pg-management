export const API_ENDPOINT = {
  room: '/api/room',
  room_ById: '/api/room/:id',
  DASHBOARD: {
    OVERVIEW: '/api/dashboard-overview'
  },
  PG: {
    pg_location: '/api/pg',
    new_pg_create: '/api/new-pg',
    pg_location_ById: '/api/pg/:id'
  },
  EMPLOYEE: {
    employee: '/api/employee',
    employee_ById: '/api/employee/:id',
    employee_password_ById: '/api/employee/change-password/:id'
  },
  ROLES: {
    role: '/api/role',
    role_ById: '/api/role/:id'
  },
  COMMON: {
    state: '/api/states',
    city: '/api/cities'
  },
  BED: {
    bed: '/api/bed',
    bed_ById: '/api/bed/:id',
    beds_ByRoomId: '/api/room/:id/bed'
  },
  TENANT: {
    tenant: '/api/tenant',
    tenant_ById: '/api/tenant/:id'
  },
  EXPENSE: {
    expense: '/api/expense',
    expense_ById: '/api/expense/:id'
  },
  EMPLOYEE_SALARY: {
    employee_salary: '/api/employee-salary',
    employee_salary_ById: '/api/employee-salary/:id'
  },
  PAYMENT: {
    payment_rent: '/api/payment/rent',
    payment_rent_byId: '/api/payment/rent/:id',
    payment_advance: '/api/payment/advance',
    payment_advance_byId: '/api/payment/advance/:id',
    payment_refund: '/api/payment/refund',
    payment_refund_byId: '/api/payment/refund/:id',
    payment_current_bill_byId: '/api/payment/current-bill/:id'
  }
};
