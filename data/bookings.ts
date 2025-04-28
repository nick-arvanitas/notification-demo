export interface Booking {
  id: string;
  date: string;
  contractor: string;
  service: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  amount: number;
}

export const mockBookings: Booking[] = [
  {
    id: '1',
    date: '2024-03-15',
    contractor: 'John Smith',
    service: 'Plumbing',
    status: 'upcoming',
    amount: 150.00
  },
  {
    id: '2',
    date: '2024-03-10',
    contractor: 'Sarah Johnson',
    service: 'Electrical',
    status: 'completed',
    amount: 200.00
  },
  {
    id: '3',
    date: '2024-03-05',
    contractor: 'Mike Brown',
    service: 'HVAC',
    status: 'completed',
    amount: 300.00
  },
  {
    id: '4',
    date: '2024-03-20',
    contractor: 'Emily Davis',
    service: 'Carpentry',
    status: 'upcoming',
    amount: 250.00
  }
];

export const bookingStats = {
  total: 24,
  upcoming: 5,
  completed: 19,
  cancelled: 2
}; 