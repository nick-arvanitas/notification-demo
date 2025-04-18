export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'client' | 'contractor' | 'admin';
  avatar?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'client',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'active',
    lastLogin: '2024-04-18T10:30:00Z'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'contractor',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'active',
    lastLogin: '2024-04-17T15:45:00Z'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.j@example.com',
    role: 'client',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'inactive',
    lastLogin: '2024-04-10T09:20:00Z'
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.w@example.com',
    role: 'contractor',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'active',
    lastLogin: '2024-04-18T08:15:00Z'
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.b@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'active',
    lastLogin: '2024-04-18T11:00:00Z'
  }
];
