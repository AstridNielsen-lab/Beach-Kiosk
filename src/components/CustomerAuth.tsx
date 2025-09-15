import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import GoogleAuth from './GoogleAuth';
import type { User as UserType } from '../types';

interface CustomerAuthProps {
  onSuccess: (user: UserType) => void;
  onClose: () => void;
}

export function CustomerAuth({ onSuccess, onClose }: CustomerAuthProps) {
  const [googleError, setGoogleError] = useState('');
  const [name, setName] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);

  const handleGoogleSuccess = (user: UserType) => {
    // Para clientes Google, definir role como 'customer'
    const customerUser = {
      ...user,
      role: 'customer' as const,
      authType: 'google' as const,
    };
    
    // Salvar no localStorage
    localStorage.setItem('beachKioskCustomer', JSON.stringify(customerUser));
    
    onSuccess(customerUser);
  };

  const handleGoogleError = (errorMessage: string) => {
    setGoogleError(errorMessage);
  };

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Por favor, insira seu nome');
      return;
    }

    const guestUser: UserType = {
      role: 'customer',
      name: name.trim(),
      timestamp: new Date(),
      authType: 'local',
    };

    // Salvar no localStorage
    localStorage.setItem('beachKioskCustomer', JSON.stringify(guestUser));
    
    onSuccess(guestUser);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-green-800">Bem-vindo ao Beach Kiosk</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Faça login para uma experiência personalizada ou continue como visitante
          </p>

          {/* Google Sign In */}
          <div className="mb-4">
            <GoogleAuth onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            {googleError && (
              <p className="mt-2 text-sm text-red-600">{googleError}</p>
            )}
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Guest Login Toggle */}
          {!showGuestForm ? (
            <button
              onClick={() => setShowGuestForm(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <User size={20} />
              Continuar como Visitante
            </button>
          ) : (
            <form onSubmit={handleGuestLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu nome (para personalizar o atendimento)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300"
                  placeholder="Digite seu nome"
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGuestForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  Continuar
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Ao fazer login, você concorda com nossos termos de uso</p>
        </div>
      </div>
    </div>
  );
}

export default CustomerAuth;
