// User related types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'manager' | 'user';

// Employee related types
export interface Employee {
  id: number;
  userId?: number;
  employeeId: string;
  department: string;
  position: string;
  hireDate: string; // ISO date string
  managerId?: number;
  employmentStatus: EmploymentStatus;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export type EmploymentStatus = 'active' | 'on_leave' | 'terminated' | 'suspended';

// License related types
export interface License {
  id: number;
  employeeId: number;
  licenseType: string;
  licenseNumber: string;
  issueDate: string; // ISO date string
  expirationDate: string; // ISO date string
  issuingAuthority: string;
  status: LicenseStatus;
  createdAt: string;
  updatedAt: string;
}

export type LicenseStatus = 'active' | 'expired' | 'pending' | 'revoked';

// Attendance related types
export interface Attendance {
  id: number;
  employeeId: number;
  date: string; // ISO date string
  clockIn?: string; // ISO datetime string
  clockOut?: string; // ISO datetime string
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';

// Document related types
export interface Document {
  id: number;
  employeeId: number;
  documentType: string;
  fileName: string;
  filePath: string;
  fileHash: string;
  uploadDate: string; // ISO datetime string
  uploadedBy: number; // User ID
  createdAt: string;
  updatedAt: string;
}