import { Head, Link, router } from '@inertiajs/react';
import { Activity, ChevronLeft, Clock, Code, Database, Info, RefreshCcw, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { dashboard } from '@/routes';
import jobsRoutes from '@/routes/jobs';
import { cn } from '@/lib/utils';

interface JobDetail {
    id: number;
    queue: string;
    payload: any;
    status: 'pending' | 'failed';
    attempts?: number;
    created_at?: string;
    available_at?: string;
    exception?: string;
    failed_at?: string;
}

export default function Show({ job }: { job: JobDetail }) {
    const [isRetryDialogOpen, setIsRetryDialogOpen] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);

    return (
        <>
            <Head title={`Job Detail - ${job.payload.displayName || job.id}`} />

            <div className="mx-2 my-2 flex flex-1 flex-col rounded-lg border border-border bg-background min-w-0">
                <header className="flex flex-col border-b border-border/40">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link href={jobsRoutes.index().url}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-muted-foreground" />
                                <p className="text-base font-medium text-foreground">Job Detail</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {job.status === 'failed' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={() => setIsRetryDialogOpen(true)}
                                >
                                    <RefreshCcw className="h-3.5 w-3.5" />
                                    Retry Job
                                </Button>
                            )}
                            <div className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium",
                                job.status === 'failed' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                            )}>
                                {job.status.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 space-y-6">
                    {/* Basic Info */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg border border-border bg-muted/30">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <Info className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Job Name</span>
                            </div>
                            <p className="text-sm font-semibold">{job.payload.displayName || 'Unknown'}</p>
                        </div>

                        <div className="p-4 rounded-lg border border-border bg-muted/30">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <Database className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Queue</span>
                            </div>
                            <p className="text-sm font-semibold">{job.queue}</p>
                        </div>

                        {job.status === 'pending' ? (
                            <div className="p-4 rounded-lg border border-border bg-muted/30">
                                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Attempts</span>
                                </div>
                                <p className="text-sm font-semibold">{job.attempts}</p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-lg border border-border bg-muted/30 text-red-700 bg-red-50/50">
                                <div className="flex items-center gap-2 mb-2 text-red-500">
                                    <ShieldAlert className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Failed At</span>
                                </div>
                                <p className="text-sm font-semibold">{job.failed_at}</p>
                            </div>
                        )}
                    </section>

                    {/* Payload */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-foreground">
                            <Code className="h-5 w-5" />
                            <h3 className="text-base font-medium">Payload Data</h3>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/50 p-4 overflow-auto">
                            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                                {JSON.stringify(job.payload, null, 2)}
                            </pre>
                        </div>
                    </section>

                    {/* Exception (if failed) */}
                    {job.status === 'failed' && (
                        <section>
                            <div className="flex items-center gap-2 mb-3 text-red-600">
                                <ShieldAlert className="h-5 w-5" />
                                <h3 className="text-base font-medium">Exception Details</h3>
                            </div>
                            <div className="rounded-lg border border-red-100 bg-red-50/30 p-4 overflow-auto border-dashed">
                                <pre className="text-xs font-mono text-red-800 whitespace-pre-wrap">
                                    {job.exception}
                                </pre>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <Dialog open={isRetryDialogOpen} onOpenChange={setIsRetryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Retry Job</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin mencoba menjalankan kembali job <strong>{job.payload.displayName || job.id}</strong>? 
                            Job ini akan dimasukkan kembali ke dalam antrean.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRetryDialogOpen(false)} disabled={isRetrying}>
                            Batal
                        </Button>
                        <Button 
                            onClick={() => {
                                setIsRetrying(true);
                                router.post(jobsRoutes.retry(job.id).url, {}, {
                                    onFinish: () => {
                                        setIsRetrying(false);
                                        setIsRetryDialogOpen(false);
                                    }
                                });
                            }} 
                            disabled={isRetrying}
                            className="gap-2"
                        >
                            {isRetrying && <RefreshCcw className="h-4 w-4 animate-spin" />}
                            Ya, Jalankan Lagi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
            title: 'Background Jobs',
            href: jobsRoutes.index().url,
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
