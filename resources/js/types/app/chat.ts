export interface Chat {
    id: number;
    jid: string;
    name: string | null;
    last_message_time: string | null;
    ephemeral_expiration: number;
    archived: boolean;
    messages_count: number;
    has_summary: boolean;
    created_at: string;
    updated_at: string;
}

export interface ChatMessage {
    id: string;
    chat_jid: string;
    sender_jid: string;
    content: string;
    timestamp: string;
    is_from_me: boolean;
    media_type: string;
    filename: string;
    url: string;
    file_length: number;
    created_at: string;
    updated_at: string;
}

export interface ChatFile {
    id: number;
    chat_message_id: string;
    chat_jid: string;
    filename: string;
    url: string;
    media_type: string;
    file_length: number;
    timestamp: string;
}

export interface ChatSummary {
    id: number;
    chat_id: number;
    summary_title: string | null;
    summary_result: string;
    message_count: number;
    created_at: string;
    updated_at: string;
}
