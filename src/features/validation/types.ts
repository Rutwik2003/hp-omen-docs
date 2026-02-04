/**
 * Validation result types
 */

export interface ValidationError {
    path: string;
    message: string;
    code?: string;
}

export interface ValidationResult<T = unknown> {
    success: boolean;
    data?: T;
    errors?: ValidationError[];
}
