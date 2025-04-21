/**
 * Call status enum
 */
export enum CallStatus {
  RINGING = 'ringing',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  MISSED = 'missed',
  BLOCKED = 'blocked',
  FAILED = 'failed',
}

/**
 * Call model
 */
export interface Call {
  id: string;
  userId: string;
  callerNumber: string;
  callerName?: string;
  status: CallStatus;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  transcription?: string;
  spamScore?: number;
  intent?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Callback status enum
 */
export enum CallbackStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  MISSED = 'missed',
  CANCELLED = 'cancelled',
}

/**
 * Callback model
 */
export interface Callback {
  id: string;
  callId: string;
  userId: string;
  callerNumber: string;
  scheduledTime: string;
  status: CallbackStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User model
 */
export interface User {
  id: string;
  firebaseUid?: string;
  email: string;
  name?: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Responses
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: number;
} 