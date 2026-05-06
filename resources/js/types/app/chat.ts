export interface Chat {
    id: number;
    jid: string;
    name: string | null;
    last_message_time: string | null;
    ephemeral_expiration: number;
    archived: boolean;
    created_at: string;
    updated_at: string;
}
