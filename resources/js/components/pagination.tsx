import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    meta: {
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        per_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

export function Pagination({ meta }: Props) {
    const { filters } = usePage().props as any;

    if (meta.total <= 0) return null;

    const prevPageUrl = meta.links[0].url;
    const nextPageUrl = meta.links[meta.links.length - 1].url;
    const firstPageUrl = meta.links[1].url;
    const lastPageUrl = meta.links[meta.links.length - 2].url;

    const pageLinks = meta.links.slice(1, -1);

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            window.location.pathname,
            { ...filters, limit: e.target.value, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    return (
        <div className="border-t border-border bg-background px-4 py-2 text-xs text-muted-foreground">
            {/* Mobile pagination (simplified) */}
            <div className="flex items-center justify-between gap-2 md:hidden">
                <div>
                    Page {meta.current_page} of {meta.last_page}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild={!!prevPageUrl}
                        disabled={!prevPageUrl}
                    >
                        {prevPageUrl ? (
                            <Link href={prevPageUrl as string} preserveScroll>
                                ‹
                            </Link>
                        ) : (
                            <span>‹</span>
                        )}
                    </Button>
                    <span className="min-w-6 text-center">{meta.current_page}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild={!!nextPageUrl}
                        disabled={!nextPageUrl}
                    >
                        {nextPageUrl ? (
                            <Link href={nextPageUrl as string} preserveScroll>
                                ›
                            </Link>
                        ) : (
                            <span>›</span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Desktop / tablet pagination */}
            <div className="hidden items-center justify-between md:flex">
                <div>
                    Page {meta.current_page} of {meta.last_page}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            asChild={!!firstPageUrl}
                            disabled={meta.current_page === 1}
                        >
                            {meta.current_page > 1 ? (
                                <Link href={firstPageUrl as string} preserveScroll>
                                    «
                                </Link>
                            ) : (
                                <span>«</span>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            asChild={!!prevPageUrl}
                            disabled={!prevPageUrl}
                        >
                            {prevPageUrl ? (
                                <Link href={prevPageUrl as string} preserveScroll>
                                    ‹
                                </Link>
                            ) : (
                                <span>‹</span>
                            )}
                        </Button>

                        {pageLinks.map((link, idx) =>
                            link.label === '...' ? (
                                <span key={`ellipsis-${idx}`} className="px-1">
                                    ...
                                </span>
                            ) : (
                                <Button
                                    key={idx}
                                    variant={link.active ? 'outline' : 'ghost'}
                                    size="sm"
                                    className="h-7 min-w-7 px-2 text-xs"
                                    asChild={!!link.url}
                                    disabled={!link.url}
                                >
                                    {link.url ? (
                                        <Link href={link.url as string} preserveScroll>
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <span>{link.label}</span>
                                    )}
                                </Button>
                            )
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            asChild={!!nextPageUrl}
                            disabled={!nextPageUrl}
                        >
                            {nextPageUrl ? (
                                <Link href={nextPageUrl as string} preserveScroll>
                                    ›
                                </Link>
                            ) : (
                                <span>›</span>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            asChild={!!lastPageUrl}
                            disabled={meta.current_page === meta.last_page}
                        >
                            {meta.current_page < meta.last_page ? (
                                <Link href={lastPageUrl as string} preserveScroll>
                                    »
                                </Link>
                            ) : (
                                <span>»</span>
                            )}
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        <span>Rows per page</span>
                        <select
                            className="h-7 rounded-md border border-border bg-background px-2 text-xs outline-none focus:ring-1 focus:ring-primary/20"
                            value={meta.per_page}
                            onChange={handlePerPageChange}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
