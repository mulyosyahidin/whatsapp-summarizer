import { Head, Link, router } from '@inertiajs/react';
import { DatabaseZap, ExternalLink, FileText, MessageSquare, RefreshCw, Search, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/pagination';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import chats from '@/routes/chats';
import summaries from '@/routes/summaries';
import { type ChatSummary, type PaginatedResult } from '@/types';

export default function Index({
    summaries: paginatedSummaries,
    filters,
}: {
    summaries: PaginatedResult<ChatSummary>;
    filters: { search?: string };
}) {
    const [query, setQuery] = useState(filters.search ?? '');
    const [isSyncingAll, setIsSyncingAll] = useState(false);
    const [showSyncConfirm, setShowSyncConfirm] = useState(false);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(
                summaries.index().url,
                { ...filters, search: query, page: 1 },
                { preserveState: true, replace: true },
            );
        }
    };

    const handleSummarizeAll = () => {
        setIsSyncingAll(true);
        router.post(summaries.summarizeAll().url, {}, {
            onFinish: () => {
                setIsSyncingAll(false);
                setShowSyncConfirm(false);
            },
        });
    };

    return (
        <>
            <Head title="AI Summaries" />

            <div className="mx-2 my-2 flex flex-1 flex-col rounded-lg border border-border bg-background min-w-0">
                <header className="flex flex-col border-b border-border/40">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <p className="text-base font-medium text-foreground">AI Chat Summaries</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 rounded-full"
                                            onClick={() => setShowSyncConfirm(true)}
                                            disabled={isSyncingAll}
                                        >
                                            <DatabaseZap className={cn('h-4 w-4 text-muted-foreground', isSyncingAll && 'animate-pulse')} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Summarize Semua Chat (Background)</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-3">
                        <div className="relative max-w-xs flex-1">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Cari rangkuman (Enter)..."
                                className="h-8 rounded-lg border border-border bg-muted/50 pl-8 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto px-4 pb-2 pt-4">
                    {paginatedSummaries.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 py-14 text-center">
                            <FileText className="h-8 w-8 text-muted-foreground/40" />
                            <p className="mt-2 text-sm font-medium text-foreground">Belum ada rangkuman ditemukan</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Rangkuman akan muncul setelah Anda menekan tombol "Summarize" di halaman detail chat.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg border border-border flex flex-col">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted">
                                        <tr className="hover:bg-transparent border-b border-border">
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground w-10 text-center">#</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Chat / Kontak</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Judul Rangkuman</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Pesan Dirangkum</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Tanggal</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground text-right w-16">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {paginatedSummaries.data.map((summary, index) => (
                                            <tr key={summary.id} className="hover:bg-muted/60 transition-colors">
                                                <td className="px-4 py-3 text-center text-xs font-mono text-muted-foreground">
                                                    {(paginatedSummaries.meta.current_page - 1) * paginatedSummaries.meta.per_page + index + 1}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-foreground leading-snug">
                                                                {summary.chat?.name || 'Unknown'}
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                                {summary.chat?.jid}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm text-foreground line-clamp-1">
                                                        {summary.summary_title || 'No Title'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {summary.message_count} pesan
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {new Date(summary.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" asChild title="Lihat Chat">
                                                        <Link href={chats.show(summary.chat_id).url}>
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination meta={paginatedSummaries.meta} />
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={showSyncConfirm} onOpenChange={setShowSyncConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Summarize Semua Chat</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin membuat rangkuman untuk semua chat? Proses ini akan berjalan di background dan mungkin memakan waktu tergantung jumlah chat.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowSyncConfirm(false)} disabled={isSyncingAll}>
                            Batal
                        </Button>
                        <Button onClick={handleSummarizeAll} disabled={isSyncingAll} className="gap-2">
                            {isSyncingAll && <RefreshCw className="h-4 w-4 animate-spin" />}
                            Ya, Summarize Semua
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
            title: 'Summaries',
            href: summaries.index().url,
        },
    ],
};
