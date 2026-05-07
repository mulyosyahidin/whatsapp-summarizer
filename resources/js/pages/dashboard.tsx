import { Head, Link } from '@inertiajs/react';
import { MessageSquare, Users, ChevronRight, User, Contact as ContactIcon, Zap, BarChart3, BrainCircuit, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { dashboard } from '@/routes';
import chats from '@/routes/chats';
import contactsRoute from '@/routes/contacts';
import { type Chat, type Contact } from '@/types';

interface DashboardProps {
    stats: {
        total_chats: number;
        total_messages: number;
        total_contacts: number;
    };
    ai_stats: {
        total_cost: number;
        total_tokens_input: number;
        total_tokens_output: number;
        top_model: string;
        top_model_usage_count: number;
    };
    latest_chats: {
        data: Chat[];
    };
    latest_contacts: {
        data: Contact[];
    };
}

export default function Dashboard({ stats, ai_stats, latest_chats, latest_contacts }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 border-teal-500/20 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-teal-700 dark:text-teal-400">Total Chat</CardTitle>
                            <MessageSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-teal-900 dark:text-teal-50">{stats.total_chats}</div>
                            <p className="text-xs text-teal-600/80 dark:text-teal-400/80 mt-1">Chat terdaftar</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Pesan</CardTitle>
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-50">{stats.total_messages}</div>
                            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">Pesan tersinkronisasi</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">Total Kontak</CardTitle>
                            <ContactIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-900 dark:text-purple-50">{stats.total_contacts}</div>
                            <p className="text-xs text-purple-600/80 dark:text-purple-400/80 mt-1">Kontak tersinkronisasi</p>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="shadow-sm border-border/60 bg-muted/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Biaya AI</CardTitle>
                            <Coins className="h-3.5 w-3.5 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">${Number(ai_stats.total_cost).toFixed(4)}</div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Estimasi biaya OpenRouter</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-border/60 bg-muted/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Token In (Prompt)</CardTitle>
                            <Zap className="h-3.5 w-3.5 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{Intl.NumberFormat('en-US', { notation: 'compact' }).format(ai_stats.total_tokens_input)}</div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Total token masuk</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-border/60 bg-muted/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Token Out (Compl.)</CardTitle>
                            <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{Intl.NumberFormat('en-US', { notation: 'compact' }).format(ai_stats.total_tokens_output)}</div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Total token keluar</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-border/60 bg-muted/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Top Model</CardTitle>
                            <BrainCircuit className="h-3.5 w-3.5 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-bold truncate pr-1" title={ai_stats.top_model}>
                                {ai_stats.top_model.split('/').pop()}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                Model paling sering digunakan ({ai_stats.top_model_usage_count}x)
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Latest Chats */}
                    <Card className="shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Chat Terbaru</CardTitle>
                                <CardDescription>5 chat terakhir</CardDescription>
                            </div>
                            <Link 
                                href={chats.index().url} 
                                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                            >
                                Semua <ChevronRight className="h-3 w-3" />
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 border-y border-border/40">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Kontak</th>
                                            <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {latest_chats.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="px-4 py-6 text-center text-muted-foreground italic">
                                                    Belum ada chat.
                                                </td>
                                            </tr>
                                        ) : (
                                            latest_chats.data.map((chat) => (
                                                <tr key={chat.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                                <User className="h-4 w-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-medium text-foreground truncate max-w-[150px]">{chat.name || 'Unknown'}</div>
                                                                <div className="text-[10px] font-mono text-muted-foreground truncate">{chat.jid}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Link 
                                                            href={chats.show(chat.id).url}
                                                            className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent h-7 px-2"
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

                    {/* Latest Contacts */}
                    <Card className="shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Kontak Terbaru</CardTitle>
                                <CardDescription>5 kontak terakhir</CardDescription>
                            </div>
                            <Link 
                                href={contactsRoute.index().url} 
                                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                            >
                                Semua <ChevronRight className="h-3 w-3" />
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 border-y border-border/40">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama</th>
                                            <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {latest_contacts.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="px-4 py-6 text-center text-muted-foreground italic">
                                                    Belum ada kontak.
                                                </td>
                                            </tr>
                                        ) : (
                                            latest_contacts.data.map((contact) => (
                                                <tr key={contact.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                                                <ContactIcon className="h-4 w-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-medium text-foreground truncate max-w-[150px]">{contact.name || 'Unknown'}</div>
                                                                <div className="text-[10px] font-mono text-muted-foreground truncate">{contact.jid}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {contact.chat_id ? (
                                                            <Link 
                                                                href={chats.show(contact.chat_id).url}
                                                                className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent h-7 px-2"
                                                            >
                                                                Chat
                                                            </Link>
                                                        ) : (
                                                            <span className="text-[10px] text-muted-foreground italic">No Chat</span>
                                                        )}
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
