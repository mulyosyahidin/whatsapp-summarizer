export interface Job {
    id: number;
    queue: string;
    display_name: string;
    attempts: number;
    available_at: string;
    created_at: string;
    status: 'pending' | 'failed';
    uuid?: string;
    failed_at?: string;
}
