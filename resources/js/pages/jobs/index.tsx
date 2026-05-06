import { Head, Link, router } from '@inertiajs/react';
import { Activity, Clock, Database, Eye, Filter, RefreshCcw, Search, ShieldAlert } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import jobsRoutes from '@/routes/jobs';
import { cn } from '@/lib/utils';

interface Job {
    id: number;
    queue: string;
    display_name: string;
    attempts: number;
    available_at: string;
    created_at: string;
    status: 'pending' | 'failed';
    uuid?: string;
    failed_at?: string;
}

export default function Index({
    jobs,
    failedJobs,
}: {
    jobs: Job[];
    failedJobs: Job[];
}) {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'pending' | 'failed'>('pending');
    const [jobToRetry, setJobToRetry] = useState<Job | null>(null);
    const [isRetryAllDialogOpen, setIsRetryAllDialogOpen] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);

    const filteredJobs = (activeTab === 'pending' ? jobs : failedJobs).filter(
        (job) =>
            job.display_name.toLowerCase().includes(search.toLowerCase()) ||
            job.queue.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Background Jobs" />

            <div className="mx-2 my-2 flex flex-1 flex-col rounded-lg border border-border bg-background min-w-0">
                <header className="flex flex-col border-b border-border/40">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-muted-foreground" />
                            <p className="text-base font-medium text-foreground">Background Jobs</p>
                        </div>
                        {activeTab === 'failed' && failedJobs.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                onClick={() => setIsRetryAllDialogOpen(true)}
                                disabled={isRetrying}
                            >
                                <RefreshCcw className={cn("h-3.5 w-3.5", isRetrying && "animate-spin")} />
                                Retry All Failed
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-3">
                        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border/60">
                            <Button
                                variant={activeTab === 'pending' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('pending')}
                                className="h-7 text-xs"
                            >
                                Pending ({jobs.length})
                            </Button>
                            <Button
                                variant={activeTab === 'failed' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('failed')}
                                className="h-7 text-xs"
                            >
                                Failed ({failedJobs.length})
                            </Button>
                        </div>

                        <div className="relative max-w-xs flex-1">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari job..."
                                className="h-8 rounded-lg border border-border bg-muted/50 pl-8 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto px-4 pb-2 pt-4">
                    {filteredJobs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 py-14 text-center">
                            <Database className="h-8 w-8 text-muted-foreground/40" />
                            <p className="mt-2 text-sm font-medium text-foreground">Tidak ada job ditemukan</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg border border-border flex flex-col">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted">
                                        <tr className="hover:bg-transparent border-b border-border">
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground w-10 text-center">ID</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Name</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Queue</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                                                {activeTab === 'pending' ? 'Created' : 'Failed'}
                                            </th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground text-right w-16">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {filteredJobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-muted/60 transition-colors">
                                                <td className="px-4 py-3 text-center text-xs font-mono text-muted-foreground">
                                                    {job.id}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn(
                                                            "flex h-7 w-7 items-center justify-center rounded-full",
                                                            activeTab === 'failed' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                                                        )}>
                                                            {activeTab === 'failed' ? <ShieldAlert className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-foreground leading-snug">
                                                                {job.display_name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-mono text-muted-foreground">
                                                        {job.queue}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {activeTab === 'pending' ? job.created_at : job.failed_at}
                                                </td>
                                                <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                                                    {activeTab === 'failed' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => setJobToRetry(job)}
                                                            title="Retry Job"
                                                        >
                                                            <RefreshCcw className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" asChild title="Detail">
                                                        <Link href={jobsRoutes.show({ type: activeTab, id: job.id }).url}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={!!jobToRetry} onOpenChange={(open) => !open && setJobToRetry(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Retry Job</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin mencoba menjalankan kembali job <strong>{jobToRetry?.display_name}</strong>? 
                            Job ini akan dimasukkan kembali ke dalam antrean.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setJobToRetry(null)} disabled={isRetrying}>
                            Batal
                        </Button>
                        <Button 
                            onClick={() => {
                                if (jobToRetry) {
                                    setIsRetrying(true);
                                    router.post(jobsRoutes.retry(jobToRetry.id).url, {}, {
                                        onFinish: () => {
                                            setIsRetrying(false);
                                            setJobToRetry(null);
                                        }
                                    });
                                }
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

            <Dialog open={isRetryAllDialogOpen} onOpenChange={setIsRetryAllDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Retry Semua Job</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin mencoba menjalankan kembali <strong>semua ({failedJobs.length})</strong> job yang gagal? 
                            Semua job ini akan dimasukkan kembali ke dalam antrean.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRetryAllDialogOpen(false)} disabled={isRetrying}>
                            Batal
                        </Button>
                        <Button 
                            onClick={() => {
                                setIsRetrying(true);
                                router.post(jobsRoutes.retryAll().url, {}, {
                                    onFinish: () => {
                                        setIsRetrying(false);
                                        setIsRetryAllDialogOpen(false);
                                    }
                                });
                            }} 
                            disabled={isRetrying}
                            className="gap-2"
                        >
                            {isRetrying && <RefreshCcw className="h-4 w-4 animate-spin" />}
                            Ya, Jalankan Semua
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
            title: 'Background Jobs',
            href: jobsRoutes.index().url,
        },
    ],
};
