export interface Booking {
  id: string;
  date: string;
  clientName: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
}

export interface Export {
  id: string;
  type: string;
  date: string;
  status: 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
}

export const mockBookings: Booking[] = [
  {
    id: '1',
    date: '2024-04-18',
    clientName: 'John Doe',
    serviceType: 'Consultation',
    status: 'confirmed',
    amount: 150.00
  },
  {
    id: '2',
    date: '2024-04-19',
    clientName: 'Jane Smith',
    serviceType: 'Full Service',
    status: 'pending',
    amount: 300.00
  },
  {
    id: '3',
    date: '2024-04-20',
    clientName: 'Bob Johnson',
    serviceType: 'Follow-up',
    status: 'completed',
    amount: 100.00
  }
];

export const mockExports: Export[] = [
  {
    id: '1',
    type: 'Bookings Report',
    date: '2024-04-18',
    status: 'completed',
    downloadUrl: '/downloads/bookings-2024-04-18.csv'
  },
  {
    id: '2',
    type: 'Revenue Report',
    date: '2024-04-17',
    status: 'processing'
  },
  {
    id: '3',
    type: 'Client List',
    date: '2024-04-16',
    status: 'failed'
  }
]; 