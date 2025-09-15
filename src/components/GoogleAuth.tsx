import React, { useEffect } from 'react';
import type { User } from '../types';

interface GoogleAuthProps {
  onSuccess: (user: User) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function GoogleAuth({ onSuccess, onError }: GoogleAuthProps) {
  useEffect(() => {
    // Carregar o script do Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        const buttonElement = document.getElementById('google-signin-button');
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    try {
      // Decodificar o JWT token
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const user: User = {
        role: 'admin', // Pode ser configurado baseado no email ou outros critérios
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        googleId: payload.sub,
        authType: 'google',
        timestamp: new Date(),
      };

      // Salvar no localStorage
      localStorage.setItem('beachKioskUser', JSON.stringify(user));
      
      onSuccess(user);
    } catch (error) {
      console.error('Erro ao processar resposta do Google:', error);
      onError('Erro ao processar autenticação do Google');
    }
  };

  return (
    <div className="google-auth-container">
      <div id="google-signin-button" className="flex justify-center"></div>
    </div>
  );
}

export default GoogleAuth;
