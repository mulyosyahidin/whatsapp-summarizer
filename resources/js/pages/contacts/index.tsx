import { Head, Link, router } from '@inertiajs/react';
import { MessageSquare, RefreshCw, Search, User, Users } from 'lucide-react';
import { useState } from 'react';
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
import contactsRoute from '@/routes/contacts';
import { type Contact, type PaginatedResult } from '@/types';

export interface ContactFilters {
    search?: string;
}

export default function Index({
    contacts,
    filters,
}: {
    contacts: PaginatedResult<Contact>;
    filters: ContactFilters;
}) {
    const [query, setQuery] = useState(filters.search ?? '');
    const [isSyncing, setIsSyncing] = useState(false);
    const [showSyncConfirm, setShowSyncConfirm] = useState(false);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(
                contactsRoute.index().url,
                { ...filters, search: query, page: 1 },
                { preserveState: true, replace: true },
            );
        }
    };

    const handleSync = () => {
        setIsSyncing(true);
        router.post(contactsRoute.sync().url, {}, {
            onFinish: () => {
                setIsSyncing(false);
                setShowSyncConfirm(false);
            },
        });
    };

    return (
        <>
            <Head title="Kontak" />

            <div className="mx-2 my-2 flex flex-1 flex-col rounded-lg border border-border bg-background min-w-0">
                <header className="flex flex-col border-b border-border/40">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <p className="text-base font-medium text-foreground">WhatsApp Kontak</p>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                        onClick={() => setShowSyncConfirm(true)}
                                        disabled={isSyncing}
                                    >
                                        <RefreshCw className={cn('h-4 w-4 text-muted-foreground', isSyncing && 'animate-spin')} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Sinkronisasi Kontak</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-3">
                        <div className="relative max-w-xs flex-1">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Cari kontak (Enter)..."
                                className="h-8 rounded-lg border border-border bg-muted/50 pl-8 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto px-4 pb-2 pt-4">
                    {contacts.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 py-14 text-center">
                            <Users className="h-8 w-8 text-muted-foreground/40" />
                            <p className="mt-2 text-sm font-medium text-foreground">Belum ada kontak ditemukan</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Silakan lakukan sinkronisasi untuk mengambil data kontak dari WhatsApp.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg border border-border flex flex-col">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted">
                                        <tr className="hover:bg-transparent border-b border-border">
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground w-10 text-center">#</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Nama</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">JID</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Ditambahkan</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground text-right w-16">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {contacts.data.map((contact, index) => (
                                            <tr key={contact.id} className="hover:bg-muted/60 transition-colors">
                                                <td className="px-4 py-3 text-center text-xs font-mono text-muted-foreground">
                                                    {(contacts.meta.current_page - 1) * contacts.meta.per_page + index + 1}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        <span className="text-sm font-medium text-foreground leading-snug">
                                                            {contact.name || 'Unknown'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                                                    {contact.jid}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {contact.created_at}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {contact.chat_id ? (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Link 
                                                                        href={chats.show(contact.chat_id).url}
                                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                                    >
                                                                        <MessageSquare className="h-3.5 w-3.5" />
                                                                    </Link>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="left">Lihat Chat</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground italic">No Chat</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination meta={contacts.meta} />
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={showSyncConfirm} onOpenChange={setShowSyncConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sinkronisasi Kontak</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin melakukan sinkronisasi kontak dari WhatsApp? Proses ini akan mengambil seluruh daftar kontak Anda.
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
            title: 'Kontak',
            href: contactsRoute.index().url,
        },
    ],
};
