// User Types
export interface User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export enum UserRole {
    ADMIN = 'ADMIN',
    HR_MANAGER = 'HR_MANAGER',
    HR_STAFF = 'HR_STAFF',
    EMPLOYEE = 'EMPLOYEE'
  }
  
  // Employee Types
  export interface Employee {
    id: number;
    userId: number;
    employeeId: string;
    department: string;
    position: string;
    hireDate: Date;
    managerId: number | null;
    employmentStatus: EmploymentStatus;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    createdAt: Date;
    updatedAt: Date;
    // Relations
    user?: User;
    manager?: Employee;
    subordinates?: Employee[];
  }
  
  export enum EmploymentStatus {
    ACTIVE = 'ACTIVE',
    ON_LEAVE = 'ON_LEAVE',
    TERMINATED = 'TERMINATED',
    SUSPENDED = 'SUSPENDED'
  }
  
  // License Types
  export interface License {
    id: number;
    employeeId: number;
    licenseType: string;
    licenseNumber: string;
    issueDate: Date;
    expirationDate: Date;
    issuingAuthority: string;
    status: LicenseStatus;
    createdAt: Date;
    updatedAt: Date;
    // Relations
    employee?: Employee;
  }
  
  export enum LicenseStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    PENDING = 'PENDING',
    REVOKED = 'REVOKED'
  }
  
  // Attendance Types
  export interface Attendance {
    id: number;
    employeeId: number;
    date: Date;
    clockIn: Date | null;
    clockOut: Date | null;
    status: AttendanceStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    // Relations
    employee?: Employee;
  }
  
  export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LATE = 'LATE',
    HALF_DAY = 'HALF_DAY',
    ON_LEAVE = 'ON_LEAVE'
  }
  
  // Document Types
  export interface Document {
    id: number;
    employeeId: number;
    documentType: string;
    fileName: string;
    filePath: string;
    fileHash: string;
    uploadDate: Date;
    uploadedBy: number;
    createdAt: Date;
    updatedAt: Date;
    // Relations
    employee?: Employee;
    uploader?: User;
  }
  
  // Auth Types
  export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    employee: Employee | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  
  // API Response Types
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }