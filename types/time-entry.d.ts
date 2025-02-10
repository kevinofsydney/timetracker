export interface TimeEntryCreateInput {
  shiftType: 'STANDARD' | 'SUNDAY' | 'EMERGENCY' | 'OVERNIGHT'
  concert: string  // Make concert mandatory
} 