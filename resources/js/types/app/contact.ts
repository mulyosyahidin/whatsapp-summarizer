export interface Contact {
    id: number;
    jid: string;
    name: string | null;
    chat_id: number | null;
    created_at: string;
    updated_at: string;
}
