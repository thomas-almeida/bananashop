import { ReactNode } from 'react';
import TopBar from '@/app/components/ui/TopBar';

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {/* Top Navigation Bar */}
            <header>
                <div className="max-w-7xl mx-auto">
                    <TopBar />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}