import React from 'react';
import { ShopItem, UserStats } from '../types';
import { ShoppingBag, Lock, Check } from 'lucide-react';

interface ShopProps {
    stats: UserStats;
    onBuy: (item: ShopItem) => void;
    onClose: () => void;
}

const SHOP_ITEMS: ShopItem[] = [
    { id: 'theme_cyberpunk', type: 'theme', name: 'Cyberpunk Theme', description: 'Neon lights and dark streets.', cost: 500, rarity: 'rare', value: 'cyberpunk' },
    { id: 'theme_gruvbox', type: 'theme', name: 'Gruvbox Theme', description: 'Retro groove aesthetic.', cost: 300, rarity: 'common', value: 'gruvbox' },
    { id: 'theme_dracula', type: 'theme', name: 'Dracula Theme', description: 'Famous vampire palette.', cost: 300, rarity: 'common', value: 'dracula' },
    { id: 'cursor_block', type: 'cursor', name: 'Block Cursor', description: 'Old school terminal block.', cost: 100, rarity: 'common', value: 'block' },
    { id: 'cursor_underline', type: 'cursor', name: 'Underline Cursor', description: 'Minimalist line.', cost: 100, rarity: 'common', value: 'underline' },
    { id: 'booster_xp', type: 'booster', name: '2x XP Booster', description: 'Double XP for 30 mins.', cost: 200, rarity: 'rare', value: 'xp_2x' },
];

const Shop: React.FC<ShopProps> = ({ stats, onBuy, onClose }) => {
    const inventoryIds = (stats.inventory || []).map(i => i.itemId);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-8" onClick={onClose}>
            <div className="bg-[#0f172a] w-full max-w-4xl h-[80vh] rounded-[2rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                <header className="p-8 border-b border-white/5 flex justify-between items-center bg-indigo-600/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-white">Item Shop</h2>
                            <p className="opacity-60 text-sm font-medium">Spend your hard-earned TypeCoins</p>
                        </div>
                    </div>
                    <div className="bg-black/40 px-6 py-3 rounded-full border border-white/10">
                        <span className="text-yellow-500 font-black text-xl flex items-center gap-2">
                            {stats.typeCoins || 0} <span className="text-xs uppercase tracking-widest text-white/40">Coins</span>
                        </span>
                    </div>
                </header>

                <div className="overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SHOP_ITEMS.map(item => {
                        const owned = inventoryIds.includes(item.id);
                        const canAfford = (stats.typeCoins || 0) >= item.cost;

                        return (
                            <div key={item.id} className={`relative p-6 rounded-3xl border-2 flex flex-col gap-4 transition-all group ${owned ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10'}`}>
                                <div className="flex justify-between items-start">
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${item.rarity === 'legendary' ? 'bg-orange-500 text-black' : item.rarity === 'rare' ? 'bg-purple-500 text-white' : 'bg-slate-500 text-white'}`}>
                                        {item.rarity}
                                    </span>
                                    {owned && <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                                </div>

                                <div>
                                    <h3 className="font-black text-lg leading-tight mb-1">{item.name}</h3>
                                    <p className="text-xs opacity-60 leading-relaxed">{item.description}</p>
                                </div>

                                <div className="mt-auto pt-4 flex gap-4">
                                    <button
                                        onClick={() => !owned && canAfford && onBuy(item)}
                                        disabled={owned || !canAfford}
                                        className={`flex-1 py-3 rounded-xl font-black text-sm uppercase transition-all flex items-center justify-center gap-2 ${owned
                                                ? 'bg-transparent text-emerald-500 cursor-default'
                                                : canAfford
                                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:scale-105 active:scale-95'
                                                    : 'bg-white/5 text-slate-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {owned ? 'Owned' : <>{item.cost} Coins</>}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Shop;
