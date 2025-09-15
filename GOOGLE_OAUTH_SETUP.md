# Configuração do Google OAuth para Beach Kiosk

## Pré-requisitos
- Conta Google para acessar o Google Cloud Console
- Projeto no Google Cloud Console (se não tiver, será criado automaticamente)

## Passo a Passo para Configuração

### 1. Acesse o Google Cloud Console
- Vá para https://console.cloud.google.com/
- Faça login com sua conta Google

### 2. Crie ou Selecione um Projeto
- No topo da página, clique no seletor de projetos
- Crie um novo projeto ou selecione um existente
- Nome sugerido: "Beach Kiosk Manager"

### 3. Habilite a Google Identity Services API
- No menu lateral, vá em "APIs & Services" > "Library"
- Procure por "Google Identity Services API"
- Clique em "Enable"

### 4. Configure a Tela de Consentimento OAuth
- No menu lateral, vá em "APIs & Services" > "OAuth consent screen"
- Escolha "External" como tipo de usuário
- Preencha os campos obrigatórios:
  - **Nome do aplicativo**: Beach Kiosk Manager
  - **Email de suporte do usuário**: seu email
  - **Logotipo do aplicativo**: (opcional)
  - **Domínios autorizados**: vercel.app
  - **Email do desenvolvedor**: seu email
- Clique em "Save and Continue"

### 5. Configurar Escopos (Scopes)
- Na página de escopos, clique em "Add or Remove Scopes"
- Adicione os seguintes escopos:
  - `openid`
  - `email`
  - `profile`
- Clique em "Update" e depois "Save and Continue"

### 6. Adicionar Usuários de Teste (se necessário)
- Se o app estiver em modo de teste, adicione os emails que podem fazer login
- Clique em "Save and Continue"

### 7. Criar Credenciais OAuth 2.0
- No menu lateral, vá em "APIs & Services" > "Credentials"
- Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
- Selecione "Web application" como tipo de aplicativo
- **Nome**: Beach Kiosk OAuth Client
- **JavaScript origins autorizadas**:
  - `https://beach-kiosk.vercel.app`
  - `http://localhost:5173` (para desenvolvimento)
- **URIs de redirecionamento autorizados**:
  - `https://beach-kiosk.vercel.app/signin-google`
  - `https://beach-kiosk.vercel.app`
  - `http://localhost:5173/signin-google` (para desenvolvimento)

### 8. Obter as Credenciais
Após criar o OAuth Client, você receberá:
- **Client ID**: `SEU_GOOGLE_CLIENT_ID_AQUI`
- **Client Secret**: `SEU_GOOGLE_CLIENT_SECRET_AQUI`

## Configuração no Código

Configure as credenciais no arquivo `.env`:
```env
VITE_GOOGLE_CLIENT_ID=SEU_GOOGLE_CLIENT_ID_AQUI
VITE_GOOGLE_REDIRECT_URI=https://beach-kiosk.vercel.app/signin-google
```

## URLs Importantes

### Para Produção:
- **URL do Site**: https://beach-kiosk.vercel.app/
- **URL de Callback**: https://beach-kiosk.vercel.app/signin-google

### Para Desenvolvimento Local:
- **URL do Site**: http://localhost:5173/
- **URL de Callback**: http://localhost:5173/signin-google

## Testando a Integração

1. Faça o deploy da aplicação no Vercel
2. Acesse o site e clique em "Acessar Sistema"
3. Clique no botão "Sign in with Google"
4. Complete o fluxo de autenticação
5. Verifique se o usuário é autenticado corretamente

## Troubleshooting

### Erro "redirect_uri_mismatch"
- Verifique se as URIs de redirecionamento no Google Cloud Console correspondem exatamente às URLs usadas na aplicação
- URLs devem incluir protocolo (https:// ou http://) e não ter barra final

### Erro "invalid_client"
- Verifique se o Client ID está correto no arquivo `.env`
- Verifique se o domínio está autorizado no Google Cloud Console

### Usuário não consegue fazer login
- Se o app estiver em modo de teste, adicione o email do usuário nos "Test users"
- Considere publicar o app se for para uso geral

## Segurança

- **Nunca** exponha o Client Secret no código frontend
- O Client Secret fornecido pode ser usado apenas para fluxos server-side
- Para aplicações SPA (Single Page Application), use apenas o Client ID
- Mantenha as URLs autorizadas atualizadas no Google Cloud Console
