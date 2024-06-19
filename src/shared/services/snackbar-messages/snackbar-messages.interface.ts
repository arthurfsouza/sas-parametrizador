export interface SnackbarMessage {
    title?: string;
    message: string;
    type: 'error' | 'info' | 'success' | 'warning';
    has_duration?: boolean;
    duration?: number;
}