import { ShoppingCart, UmbrellaIcon, LogOut, Maximize2, Minimize2, Coffee } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { AnimatedText } from './AnimatedText';
import type { User } from '../types';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onRestClick: () => void;
}

export function Header({ cartItemCount, onCartClick, onAdminClick, currentUser, onLogout, onRestClick }: HeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="bg-blue-500 text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <UmbrellaIcon size={32} className="animate-[bounce_2s_ease-in-out_infinite]" />
          <AnimatedText
            text="Beach Kiosk"
            className="text-2xl font-bold"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onRestClick}
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            title="Modo descanso"
          >
            <Coffee size={24} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>
          {currentUser && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg">
              {currentUser.picture && (
                <img
                  src={currentUser.picture}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {currentUser.name}
                </span>
                {currentUser.email && (
                  <span className="text-xs opacity-75">
                    {currentUser.email}
                  </span>
                )}
              </div>
              <span className="text-xs bg-blue-700 px-2 py-1 rounded">
                {currentUser.role}
              </span>
              <button
                onClick={onLogout}
                className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
          <button
            onClick={onAdminClick}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {currentUser ? 'Painel de Controle' : 'Acessar Sistema'}
          </button>
          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-blue-600 rounded-full transition-colors"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}