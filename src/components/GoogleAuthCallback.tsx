import React, { useEffect } from 'react';

interface GoogleAuthCallbackProps {
  onComplete: () => void;
}

export function GoogleAuthCallback({ onComplete }: GoogleAuthCallbackProps) {
  useEffect(() => {
    // Processar os parâmetros da URL após o redirect do Google
    const processAuthCode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (code) {
        // Aqui você processaria o código de autorização
        // Por enquanto, apenas redirecionamos para a página principal
        console.log('Código de autorização recebido:', code);
        
        // Limpar a URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Voltar para a página principal
        onComplete();
      } else {
        // Se não há código, volta para a página principal
        onComplete();
      }
    };

    processAuthCode();
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Processando autenticação...</h2>
        <p className="text-gray-500 mt-2">Aguarde um momento</p>
      </div>
    </div>
  );
}

export default GoogleAuthCallback;
