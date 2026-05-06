export interface AiLog {
    id: number;
    provider: string;
    model: string;
    status: 'success' | 'failed';
    prompt?: string;
    response?: string;
    tokens_input: number;
    tokens_output: number;
    cost: string;
    error_message?: string;
    metadata?: any;
    created_at: string;
    user?: {
        name: string;
    };
}
