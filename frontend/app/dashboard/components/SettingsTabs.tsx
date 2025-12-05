'use client';

import { Store, CreditCard } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import StoreSettings from './StoreSettings';
import BankingSettings from './BankingSettings';

export default function SettingsTabs({ storeData, user }: { storeData: any, user: any }) {
    return (
        <Tabs defaultValue="store" className="w-full">
            <TabsList className="mb-6 grid grid-cols-2">
                <TabsTrigger value="store" className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    <span>Loja</span>
                </TabsTrigger>
                <TabsTrigger value="banking" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Dados Bancários</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="store">
                <StoreSettings storeData={storeData} user={user} />
            </TabsContent>

            <TabsContent value="banking">
                <BankingSettings user={user} />
            </TabsContent>
        </Tabs>
    );
}
