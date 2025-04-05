export interface IBedProps {
  id: number;
  bedNo: string;
  roomId: number;
  pgId: number;
  images: string[];
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
  status: 'ACTIVE' | 'INACTIVE';
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
  rentPrice: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ITenantPaymentProps {
  id: number;
  tenantId: number;
  pgId: number;
  roomId: number;
  bedId: number;
  amountPaid: string;
  paymentDate: string;
  paymentMethod: 'GPAY' | 'PHONEPE' | 'CASH' | 'BANK_TRANSFER';
  status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUND';
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
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  tenantPayments: ITenantPaymentProps[];
  images: string[];
  proofDocuments: string[];
}

export type IOptionTypeProps = {
  value: string;
  label: string;
};
