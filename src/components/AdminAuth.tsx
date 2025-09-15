import React, { useState } from 'react';
import { KeyRound, X } from 'lucide-react';
import GoogleAuth from './GoogleAuth';
import type { UserRole, User } from '../types';

interface AdminAuthProps {
  onSuccess: (user: User) => void;
  onClose: () => void;
}

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'waiter', label: 'Garçom' },
  { value: 'cashier', label: 'Caixa' },
];

export function AdminAuth({ onSuccess, onClose }: AdminAuthProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'Beach') {
      const user: User = {
        role: selectedRole,
        name,
        timestamp: new Date(),
        authType: 'local',
      };
      
      // Save to localStorage
      localStorage.setItem('beachKioskUser', JSON.stringify(user));
      
      onSuccess(user);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleGoogleSuccess = (user: User) => {
    onSuccess(user);
  };

  const handleGoogleError = (errorMessage: string) => {
    setGoogleError(errorMessage);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Acesso ao Sistema</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Google Sign In */}
        <div className="mb-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-3">Entre com sua conta Google:</p>
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Acesso
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              placeholder="Seu nome"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Digite a senha"
                required
              />
              <KeyRound className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600">
                Senha incorreta. Por favor, tente novamente.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Acessar Sistema
          </button>
        </form>
      </div>
    </div>
  );
}