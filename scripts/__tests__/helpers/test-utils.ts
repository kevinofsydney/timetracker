import { Concert, TimeEntry, User, UserRole } from '@prisma/client'

export const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: UserRole.TRANSLATOR,
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockConcert: Concert = {
  id: '1',
  name: 'Test Concert',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockTimeEntry: TimeEntry = {
  id: '1',
  userId: mockUser.id,
  concertId: mockConcert.id,
  shiftType: 'STANDARD',
  clockIn: new Date(),
  clockOut: null,
  rawHours: null,
  roundedHours: null,
  edited: false,
  editedBy: null,
  editReason: null,
  createdAt: new Date(),
  updatedAt: new Date(),
} 