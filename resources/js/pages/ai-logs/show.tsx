import { Head, Link } from '@inertiajs/react';
import { Bot, ChevronLeft, Code, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import aiLogs from '@/routes/ai-logs';
import { cn } from '@/lib/utils';
import type { AiLog } from '@/types/app/ai-log';

export default function Show({ log }: { log: AiLog }) {
    const formatJson = (str: string | undefined) => {
        if (!str) return '';
        try {
            return JSON.stringify(JSON.parse(str), null, 2);
        } catch {
            return str;
        }
    };

    return (
        <>
            <Head title={`AI Log Detail - ${log.id}`} />

            <div className="mx-2 my-2 flex flex-1 flex-col rounded-lg border border-border bg-background min-w-0">
                <header className="flex flex-col border-b border-border/40">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link href={aiLogs.index().url}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div className="flex items-center gap-2">
                                <Bot className="h-5 w-5 text-muted-foreground" />
                                <p className="text-base font-medium text-foreground">AI Request Detail</p>
                            </div>
                        </div>
                        <div className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                            log.status === 'success' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                            {log.status === 'success' ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                            {log.status.toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 space-y-6">
                    {/* Basic Info */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg border border-border bg-muted/30">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <Bot className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Model / Provider</span>
                            </div>
                            <p className="text-sm font-semibold">{log.model}</p>
                            <p className="text-xs text-muted-foreground">{log.provider}</p>
                        </div>

                        <div className="p-4 rounded-lg border border-border bg-muted/30">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <Info className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Tokens</span>
                            </div>
                            <p className="text-sm font-semibold">In: {log.tokens_input} | Out: {log.tokens_output}</p>
                            <p className="text-xs text-muted-foreground">Total: {log.tokens_input + log.tokens_output}</p>
                        </div>

                        <div className="p-4 rounded-lg border border-border bg-muted/30">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <Info className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Estimated Cost</span>
                            </div>
                            <p className="text-sm font-semibold">${log.cost}</p>
                        </div>

                        <div className="p-4 rounded-lg border border-border bg-muted/30">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <Info className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Timestamp</span>
                            </div>
                            <p className="text-sm font-semibold">{new Date(log.created_at).toLocaleString()}</p>
                        </div>
                    </section>

                    {/* Error Message if failed */}
                    {log.status === 'failed' && log.error_message && (
                        <section className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800">
                            <h3 className="text-sm font-bold mb-2 flex items-center gap-1">
                                <ShieldAlert className="h-4 w-4" /> Error Message
                            </h3>
                            <p className="text-xs font-mono">{log.error_message}</p>
                        </section>
                    )}

                    {/* Prompt */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-foreground">
                            <Code className="h-5 w-5" />
                            <h3 className="text-base font-medium">Prompt / Input Data</h3>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/50 p-4 overflow-auto">
                            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                                {formatJson(log.prompt)}
                            </pre>
                        </div>
                    </section>

                    {/* Response */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-foreground">
                            <Code className="h-5 w-5" />
                            <h3 className="text-base font-medium">AI Response</h3>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/50 p-4 overflow-auto shadow-inner">
                            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                                {formatJson(log.response)}
                            </pre>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'AI Logs',
            href: aiLogs.index().url,
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
