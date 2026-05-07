import { Head, Link } from '@inertiajs/react';
import { Bot, Cpu, Eye, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/pagination';
import { dashboard } from '@/routes';
import aiLogs from '@/routes/ai-logs';
import { cn } from '@/lib/utils';
import type { AiLog } from '@/types/app/ai-log';
import type { PaginatedResult } from '@/types/inertia';

interface Props {
    logs: PaginatedResult<AiLog>;
    stats: {
        models: { model: string; count: number; input_tokens: number; output_tokens: number }[];
        total_count: number;
        total_input_tokens: number;
        total_output_tokens: number;
    };
}

export default function Index({ logs, stats }: Props) {
    return (
        <>
            <Head title="AI Request Logs" />

            <div className="mx-2 my-2 flex flex-1 flex-col rounded-lg border border-border bg-background min-w-0">
                <header className="flex flex-col border-b border-border/40">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-muted-foreground" />
                            <p className="text-base font-medium text-foreground">AI Request Logs</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto px-4 pb-2 pt-4">
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Requests</p>
                            <p className="mt-1 text-3xl font-black text-foreground tracking-tight">{stats.total_count}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Tokens</p>
                            <p className="mt-1 text-3xl font-black text-foreground tracking-tight">
                                {(stats.total_input_tokens + stats.total_output_tokens).toLocaleString()}
                            </p>
                            <div className="mt-2 flex gap-4 text-[10px] font-bold uppercase tracking-wider">
                                <div className="flex flex-col">
                                    <span className="text-blue-500/80">Input</span>
                                    <span className="text-foreground">{stats.total_input_tokens.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-purple-500/80">Output</span>
                                    <span className="text-foreground">{stats.total_output_tokens.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Models Distribution</p>
                            <div className="mt-2 space-y-2 overflow-y-auto max-h-[80px] scrollbar-hide">
                                {stats.models.map((m) => (
                                    <div key={m.model} className="flex flex-col gap-0.5 text-[11px] border-b border-border/50 pb-1.5 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground font-medium truncate max-w-[150px]">{m.model}</span>
                                            <span className="font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md min-w-[30px] text-center">{m.count}</span>
                                        </div>
                                        <div className="flex gap-2 text-[9px] text-muted-foreground/70 font-mono">
                                            <span>In: {Number(m.input_tokens).toLocaleString()}</span>
                                            <span>Out: {Number(m.output_tokens).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {logs.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 py-14 text-center">
                            <Bot className="h-8 w-8 text-muted-foreground/40" />
                            <p className="mt-2 text-sm font-medium text-foreground">Tidak ada log ditemukan</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg border border-border flex flex-col">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted">
                                        <tr className="hover:bg-transparent border-b border-border">
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground w-10 text-center">ID</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Model / Provider</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">User</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Tokens</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Cost</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Date</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground text-right w-16">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {logs.data.map((log) => (
                                            <tr key={log.id} className="hover:bg-muted/60 transition-colors">
                                                <td className="px-4 py-3 text-center text-xs font-mono text-muted-foreground">
                                                    {log.id}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                                                        log.status === 'success' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                    )}>
                                                        {log.status === 'success' ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                                                        {log.status.toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-foreground">{log.model}</span>
                                                        <span className="text-[10px] text-muted-foreground">{log.provider}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {log.user?.name || 'System'}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    In: {log.tokens_input} | Out: {log.tokens_output}
                                                </td>
                                                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                                                    ${log.cost}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" asChild>
                                                        <Link href={aiLogs.show(log.id).url}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination meta={logs.meta} />
                        </div>
                    )}
                </div>
            </div>
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
            title: 'AI Logs',
            href: aiLogs.index().url,
        },
    ],
};
