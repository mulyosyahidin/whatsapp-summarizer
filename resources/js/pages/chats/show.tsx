import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, FileText, RefreshCw, Send, User, Search } from 'lucide-react';
import { useState, useDeferredValue, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/pagination';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import chats from '@/routes/chats';
import { type Chat, type ChatMessage, type ChatFile, type PaginatedResult } from '@/types';

import { toast } from 'sonner';

interface Props {
    chat: Chat;
    messages: PaginatedResult<ChatMessage>;
    files: PaginatedResult<ChatFile>;
    files_count: number;
    filters: { search?: string };
}

export default function Show({ chat, messages, files, files_count, filters }: Props) {
    const [isSyncing, setIsSyncing] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [isFilesDialogOpen, setIsFilesDialogOpen] = useState(false);
    const deferredSearch = useDeferredValue(search);

    useEffect(() => {
        if (deferredSearch !== (filters.search || '')) {
            router.get(
                chats.show(chat.id).url,
                { search: deferredSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [deferredSearch, chat.id]);

    const handleSyncMessages = () => {
        setIsSyncing(true);
        router.post(chats.messages.sync(chat.id).url, {}, {
            onSuccess: () => {
                toast.success('Pesan berhasil disinkronisasi');
            },
            onError: () => {
                toast.error('Gagal menyinkronkan pesan');
            },
            onFinish: () => setIsSyncing(false),
        });
    };

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) return text;
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);
        return (
            <>
                {parts.map((part, i) =>
                    regex.test(part) ? (
                        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 dark:text-white rounded-sm px-0.5">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

    return (
        <>
            <Head title={`Chat with ${chat.name || chat.jid}`} />

            <div className="flex flex-1 flex-col p-4">
                <div className="flex h-[calc(100vh-12rem)] gap-4">
                    {/* Left Column: Messages */}
                    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                        {/* Header */}
                        <header className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                                    <Link href={chats.index().url}>
                                        <ArrowLeft className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h1 className="text-sm font-semibold text-foreground">{chat.name || 'Unknown'}</h1>
                                        <p className="text-[11px] text-muted-foreground font-mono">{chat.jid}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative hidden w-48 sm:block md:w-64">
                                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari pesan..."
                                        className="h-8 pl-9 text-xs rounded-lg"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-2 rounded-lg"
                                                onClick={handleSyncMessages}
                                                disabled={isSyncing}
                                            >
                                                <RefreshCw className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
                                                <span className="hidden sm:inline">Sync</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Sync WhatsApp</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </header>

                        {/* Conversation */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
                            {messages.data.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="rounded-full bg-muted p-4">
                                        <FileText className="h-8 w-8 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="mt-4 text-sm font-medium text-foreground">Belum ada pesan</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">Silakan klik tombol Sync untuk mengambil riwayat pesan.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {messages.data.map((message) => (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "flex w-full",
                                                message.is_from_me ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                                    message.is_from_me
                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                        : "bg-background border border-border text-foreground rounded-tl-none"
                                                )}
                                            >
                                                {message.media_type === 'document' ? (
                                                    <div className="flex items-center gap-3 py-1">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/10 dark:bg-white/10">
                                                            <FileText className="h-5 w-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="truncate font-medium text-xs">{message.filename}</p>
                                                            <p className="text-[10px] opacity-70">
                                                                {(message.file_length / 1024 / 1024).toFixed(2)} MB • PDF
                                                            </p>
                                                        </div>
                                                        <a
                                                            href={message.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="shrink-0 rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <p className="whitespace-pre-wrap leading-relaxed">{highlightText(message.content, search)}</p>
                                                )}
                                                <div
                                                    className={cn(
                                                        "mt-1 text-[10px] flex justify-end",
                                                        message.is_from_me ? "text-primary-foreground/70" : "text-muted-foreground"
                                                    )}
                                                >
                                                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <footer className="bg-background p-3">
                            <Pagination meta={messages.meta} />
                        </footer>
                    </div>

                    {/* Right Column: Chat Detail */}
                    <aside className="hidden w-80 flex-col gap-4 lg:flex">
                        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <User className="h-10 w-10" />
                                </div>
                                <h2 className="mt-4 text-base font-semibold text-foreground">{chat.name || 'Unknown'}</h2>
                                <p className="text-xs text-muted-foreground font-mono mt-1">{chat.jid}</p>

                                <div className="mt-4 flex items-center gap-2">
                                    <span className={cn(
                                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                                        chat.archived
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    )}>
                                        {chat.archived ? 'Arsip' : 'Aktif'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Info Kontak</p>
                                    <div className="mt-2 space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">ID JID</span>
                                            <span className="font-mono">{chat.jid}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Pesan Terakhir</span>
                                            <span>{chat.last_message_time ? new Date(chat.last_message_time).toLocaleString() : '-'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Ephemeral</span>
                                            <span>{chat.ephemeral_expiration > 0 ? `${chat.ephemeral_expiration} detik` : 'Mati'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs border-t border-border/50 pt-2 mt-2">
                                            <span className="text-muted-foreground">Total Berkas</span>
                                            <span className="font-medium text-primary">{files_count}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Statistik</p>
                                    <div className="mt-2 space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Total Pesan Lokal</span>
                                            <span className="font-medium">{messages.meta.total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Files Section */}
                        <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Berkas Terbaru</p>
                                <span className="text-[10px] text-muted-foreground">{files_count} Total</span>
                            </div>

                            <div className="mt-4 space-y-3">
                                {files.data.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-2">Belum ada berkas</p>
                                ) : (
                                    files.data.slice(0, 3).map((file) => (
                                        <div key={file.id} className="group flex items-center gap-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 p-2 transition-all">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground group-hover:bg-background">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-xs font-medium text-foreground">{file.filename || 'File Tanpa Nama'}</p>
                                                <p className="text-[10px] text-muted-foreground">{(file.file_length / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-background rounded-full"
                                            >
                                                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                                            </a>
                                        </div>
                                    ))
                                )}
                            </div>

                            {files_count > 0 && (
                                <Dialog open={isFilesDialogOpen} onOpenChange={setIsFilesDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="w-full mt-2 h-8 text-[10px] text-muted-foreground hover:text-foreground">
                                            Lihat Semua Berkas
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="h-[500px] w-[700px] max-w-none flex flex-col">
                                        <DialogHeader>
                                            <DialogTitle>Semua Berkas</DialogTitle>
                                            <DialogDescription>
                                                Daftar seluruh berkas yang dikirim dalam percakapan ini.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex-1 overflow-y-auto mt-4 pr-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                                {files.data.map((file) => (
                                                    <div key={file.id} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/30 transition-colors">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                            <FileText className="h-5 w-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="truncate text-sm font-medium text-foreground">{file.filename || 'File Tanpa Nama'}</p>
                                                            <p className="text-xs text-muted-foreground">{(file.file_length / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                                                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="border-t border-border pt-4">
                                            <Pagination meta={files.meta} />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}

Show.layout = (page: any) => ({
    children: page,
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Chats', href: chats.index().url },
        { title: 'Detail', href: '#' },
    ],
});
