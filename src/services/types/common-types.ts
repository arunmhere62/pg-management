export interface IBedProps {
  id: number;
  bedNo: string;
  roomId: number;
  pgId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPgLocationProps {
  id: number;
  userId: number;
  locationName: string;
  address: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  images: string[];
  cityId: number;
  stateId: number;
}

export interface IRoomProps {
  id: number;
  roomId: string;
  pgId: number;
  roomNo: string;
  bedCount: number;
  createdAt: string;
  updatedAt: string;
  rentPrice: string;
}

export interface ITenantPaymentProps {
  id: number;
  tenantId: number;
  pgId: number;
  roomId: number;
  bedId: number;
  amountPaid: string;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
}

export interface ITenantProps {
  id: number;
  tenantId: string;
  name: string;
  phoneNo: string;
  email: string;
  pgId: number;
  roomId: number;
  bedId: number;
  checkInDate: string;
  checkOutDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  tenantPayments: ITenantPaymentProps[];
}
