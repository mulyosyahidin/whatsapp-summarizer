import { Head, Link } from '@inertiajs/react';
import { MessageSquare, Users, ChevronRight, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { dashboard } from '@/routes';
import chats from '@/routes/chats';
import { type Chat } from '@/types';

interface DashboardProps {
    stats: {
        total_chats: number;
        total_messages: number;
    };
    latest_chats: {
        data: Chat[];
    };
}

export default function Dashboard({ stats, latest_chats }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 border-teal-500/20 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-teal-700 dark:text-teal-400">Total Chat</CardTitle>
                            <Users className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-teal-900 dark:text-teal-50">{stats.total_chats}</div>
                            <p className="text-xs text-teal-600/80 dark:text-teal-400/80 mt-1">Chat terdaftar</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Pesan</CardTitle>
                            <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-50">{stats.total_messages}</div>
                            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">Pesan tersinkronisasi</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Latest Chats */}
                <Card className="shadow-sm border-border/60">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold">Chat Terbaru</CardTitle>
                            <CardDescription>5 chat dengan aktifitas terakhir</CardDescription>
                        </div>
                        <Link 
                            href={chats.index().url} 
                            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                        >
                            Lihat Semua <ChevronRight className="h-3 w-3" />
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 border-y border-border/40">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Kontak</th>
                                        <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Terakhir Dilihat</th>
                                        <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {latest_chats.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                                                Belum ada chat tersedia.
                                            </td>
                                        </tr>
                                    ) : (
                                        latest_chats.data.map((chat) => (
                                            <tr key={chat.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                            <User className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-foreground">{chat.name || 'Unknown'}</div>
                                                            <div className="text-[10px] font-mono text-muted-foreground">{chat.jid}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-muted-foreground">
                                                    {chat.last_message_time ? new Date(chat.last_message_time).toLocaleString() : '—'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {chat.archived ? (
                                                        <Badge variant="outline" className="rounded-full bg-slate-100 text-slate-600 border-transparent">Archived</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="rounded-full bg-teal-50 text-teal-700 border-transparent">Active</Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link 
                                                        href={chats.show(chat.id).url}
                                                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
