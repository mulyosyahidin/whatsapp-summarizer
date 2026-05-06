import { Link } from '@inertiajs/react';
import { Activity, FileText, LayoutGrid, MessageSquare, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import chats from '@/routes/chats';
import contacts from '@/routes/contacts';
import summaries from '@/routes/summaries';
import jobs from '@/routes/jobs';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const applicationNavItems: NavItem[] = [
    {
        title: 'Chats',
        href: chats.index(),
        icon: MessageSquare,
    },
    {
        title: 'Kontak',
        href: contacts.index(),
        icon: Users,
    },
    {
        title: 'Ringkasan',
        href: summaries.index(),
        icon: FileText,
    },
];

const systemNavItems: NavItem[] = [
    {
        title: 'Jobs',
        href: jobs.index(),
        icon: Activity,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={applicationNavItems} label="Application" />
                <NavMain items={systemNavItems} label="System" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
