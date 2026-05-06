import { Head, Link, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Check, DatabaseZap, MessageSquare, MoreHorizontal, RefreshCw, Search, Trash2, User, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Pagination } from '@/components/pagination';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import chats from '@/routes/chats';
import { type Chat, type PaginatedResult } from '@/types';

export interface ChatFilters {
    search?: string;
    status?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

const FILTER_TABS: { key: string; label: string }[] = [
    { key: '', label: 'Semua' },
    { key: 'active', label: 'Aktif' },
    { key: 'archived', label: 'Diarsipkan' },
];

export default function Index({
    chats: paginatedChats,
    filters,
}: {
    chats: PaginatedResult<Chat>;
    filters: ChatFilters;
}) {
    const activeFilter = filters.status ?? '';
    const [query, setQuery] = useState(filters.search ?? '');
    const [isSyncing, setIsSyncing] = useState(false);
    const [showSyncConfirm, setShowSyncConfirm] = useState(false);
    const [isSyncingAll, setIsSyncingAll] = useState(false);
    const [showSyncAllConfirm, setShowSyncAllConfirm] = useState(false);

    function applyFilter(status: string) {
        router.get(
            chats.index().url,
            { ...filters, status, page: 1 },
            { preserveState: true, replace: true },
        );
    }

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(
                chats.index().url,
                { ...filters, search: query, page: 1 },
                { preserveState: true, replace: true },
            );
        }
    };

    const handleSync = () => {
        setIsSyncing(true);
        router.post(chats.sync().url, {}, {
            onFinish: () => {
                setIsSyncing(false);
                setShowSyncConfirm(false);
            },
        });
    };

    const handleSort = (column: string) => {
        const isCurrent = filters.sort_by === column;
        const nextOrder = isCurrent && filters.sort_order === 'asc' ? 'desc' : 'asc';
        
        router.get(
            chats.index().url,
            { ...filters, sort_by: column, sort_order: nextOrder, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (filters.sort_by !== column) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-30" />;
        return filters.sort_order === 'asc' 
            ? <ArrowUp className="ml-1 h-3 w-3 text-primary" /> 
            : <ArrowDown className="ml-1 h-3 w-3 text-primary" />;
    };

    const handleSyncAll = () => {
        setIsSyncingAll(true);
        router.post(chats.syncAll().url, {}, {
            onFinish: () => {
                setIsSyncingAll(false);
                setShowSyncAllConfirm(false);
            },
        });
    };

    return (
        <>
            <Head title="Chats" />

            <div className="mx-2 my-2 flex flex-1 flex-col rounded-lg border border-border bg-background min-w-0">
                <header className="flex flex-col border-b border-border/40">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-muted-foreground" />
                            <p className="text-base font-medium text-foreground">WhatsApp Chats</p>
                        </div>
                        <TooltipProvider>
                            <div className="flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 rounded-full"
                                            onClick={() => setShowSyncConfirm(true)}
                                            disabled={isSyncing || isSyncingAll}
                                        >
                                            <RefreshCw className={cn('h-4 w-4 text-muted-foreground', isSyncing && 'animate-spin')} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Sinkronisasi Chat</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 rounded-full"
                                            onClick={() => setShowSyncAllConfirm(true)}
                                            disabled={isSyncing || isSyncingAll}
                                        >
                                            <DatabaseZap className={cn('h-4 w-4 text-muted-foreground', isSyncingAll && 'animate-pulse')} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Sync Semua (Chat + Pesan)</TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-3">
                        <div className="inline-flex h-8 items-center rounded-full border border-border/50 bg-muted px-1 py-0.5 text-xs gap-0.5">
                            {FILTER_TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => applyFilter(tab.key)}
                                    className={[
                                        'h-7 rounded-full px-3 text-xs font-medium transition-all duration-150',
                                        activeFilter === tab.key
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground',
                                    ].join(' ')}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative max-w-xs flex-1">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Cari chat (Enter)..."
                                className="h-8 rounded-lg border border-border bg-muted/50 pl-8 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto px-4 pb-2 pt-4">
                    {paginatedChats.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 py-14 text-center">
                            <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
                            <p className="mt-2 text-sm font-medium text-foreground">Belum ada chat ditemukan</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Chat akan muncul otomatis saat ada pesan masuk dari webhook.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg border border-border flex flex-col">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted">
                                        <tr className="hover:bg-transparent border-b border-border">
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground w-10 text-center">#</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Kontak</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">JID</th>
                                            <th 
                                                className="px-4 py-2.5 text-xs font-medium text-muted-foreground w-20 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => handleSort('messages')}
                                             >
                                                <div className="flex items-center justify-center">
                                                    Pesan
                                                    <SortIcon column="messages" />
                                                </div>
                                             </th>
                                             <th 
                                                className="px-4 py-2.5 text-xs font-medium text-muted-foreground w-20 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => handleSort('summary')}
                                             >
                                                <div className="flex items-center justify-center">
                                                    Summary
                                                    <SortIcon column="summary" />
                                                </div>
                                             </th>
                                             <th 
                                                className="px-4 py-2.5 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => handleSort('last_seen')}
                                             >
                                                <div className="flex items-center">
                                                    Terakhir Dilihat
                                                    <SortIcon column="last_seen" />
                                                </div>
                                             </th>
                                             <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground w-36">Status</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground text-right w-16">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {paginatedChats.data.map((chat, index) => (
                                            <tr key={chat.id} className="hover:bg-muted/60 transition-colors">
                                                <td className="px-4 py-3 text-center text-xs font-mono text-muted-foreground">
                                                    {(paginatedChats.meta.current_page - 1) * paginatedChats.meta.per_page + index + 1}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        <span className="text-sm font-medium text-foreground leading-snug">
                                                            {chat.name || 'Unknown'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                                                    {chat.jid}
                                                </td>
                                                <td className="px-4 py-3 text-center text-xs font-mono text-muted-foreground">
                                                    {chat.messages_count}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {chat.has_summary ? (
                                                        <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                                                            <Check className="h-3 w-3" />
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600">
                                                            <X className="h-3 w-3" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {chat.last_message_time ? new Date(chat.last_message_time).toLocaleString() : '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {chat.archived ? (
                                                        <Badge variant="outline" className="rounded-full bg-slate-100 text-slate-600 border-transparent">Archived</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="rounded-full bg-teal-50 text-teal-700 border-transparent">Active</Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Aksi</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={chats.show(chat.id).url} className="flex items-center gap-2">
                                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                                    Lihat Chat
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination meta={paginatedChats.meta} />
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={showSyncConfirm} onOpenChange={setShowSyncConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sinkronisasi Chat</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin melakukan sinkronisasi ulang seluruh chat dari WhatsApp? Proses ini mungkin membutuhkan waktu beberapa saat.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowSyncConfirm(false)} disabled={isSyncing}>
                            Batal
                        </Button>
                        <Button onClick={handleSync} disabled={isSyncing}>
                            {isSyncing ? 'Sinkronisasi...' : 'Ya, Sinkronkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showSyncAllConfirm} onOpenChange={setShowSyncAllConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sync Semua Chat &amp; Pesan</DialogTitle>
                        <DialogDescription>
                            Proses ini akan menyinkronkan seluruh daftar chat terlebih dahulu, kemudian menjadwalkan sinkronisasi pesan dan file untuk setiap chat di background (queue). Pastikan queue worker sedang berjalan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowSyncAllConfirm(false)} disabled={isSyncingAll}>
                            Batal
                        </Button>
                        <Button onClick={handleSyncAll} disabled={isSyncingAll}>
                            {isSyncingAll ? 'Memproses...' : 'Ya, Sync Semua'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Chats',
            href: chats.index().url,
        },
    ],
};
