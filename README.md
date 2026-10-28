# Alfred | Protótipo acadêmico full-stack

**Slogan:** A cidade tem planos para você.

O Alfred adapta a arquitetura do projeto FitTrack recebido (Vue 3/Vite/Router/Pinia/Axios + Express/Sequelize/MySQL/JWT) para um **site de descoberta e simulação de reservas de ingressos**. A estrutura do FitTrack foi usada como referência técnica; o código do Alfred foi separado para preservar o projeto original.

## O que já foi implementado

- Navegação por **Cinema, Shows, Baladas, Teatro, Dança e Cultura**.
- Homepage responsiva, cards e detalhes de eventos.
- **Minha cidade**: filtros por cidade, categoria, nome; botão de localização opt-in via navegador e proximidade dos locais cadastrados (raio de 80 km); listagem de locais com suas próximas datas.
- **Seu Ritmo**: preferências musicais editáveis, ranking ilustrativo por coincidência de gêneros, opções por cidade.
- **Spotify**: cliente OAuth2 Authorization Code + PKCE, permite consultar *top artists* e *top tracks* mediante Client ID e autorização; se a API retornar gêneros, eles poderão ser sugeridos como preferências. Campos podem estar ausentes, então a escolha manual é mantida.
- **Apple Music**: espaço previsto na interface e documentação de integração futura. **Não está conectado**.
- Login e cadastro JWT pela API.
- Models `User`, `Venue`, `Event`, `TicketLot` e `Order` com associações Sequelize.
- Rotas de catálogo e locais; criação e consulta de **reservas simuladas**; controle de quantidade com atualização atômica no banco.
- Dados fictícios (10 locais, 16 eventos); funcionamento de navegação mesmo com API offline em modo demonstração.

## Atenção: limitações deliberadas

**Não existe venda real de ingressos neste protótipo.** Não há gateway de pagamento, assentos numerados, QR Code válido, reembolso, comunicação por e-mail ou confirmação financeira. Os dados de exemplo, nomes de locais, coordenadas, valores e eventos são totalmente fictícios e **não representam uma programação real**.

Quando a API está offline, o frontend mostra eventos locais de demonstração e pode salvar simulações no `localStorage` do navegador. Quando a API está ativa, cadastros e reservas são mantidos no MySQL. Não misture esses dados com ingressos comerciais.

## Como rodar (Node 20+ e MySQL/MariaDB)

1. Crie o banco de dados vazio no servidor MySQL/MariaDB:
   ```sql
   CREATE DATABASE alfred_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Backend:
   ```bash
   cd alfred-backend
   cp .env.example .env
   # Edite DB_USER, DB_PASSWORD, DB_NAME e um JWT_SECRET aleatório em .env
   npm install
   npm run seed
   npm run dev
   ```
   API: `http://localhost:3000/api` (ou `http://127.0.0.1:3000/api`).
3. Frontend, em outro terminal:
   ```bash
   cd alfred-frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
   Abra **http://127.0.0.1:5173** no navegador. O comando Vite do projeto já usa o host 127.0.0.1.
4. Acesse a tela de cadastro e crie um usuário. Clique em qualquer evento para simular uma reserva. As APIs exigem o banco ativo.

> `npm run seed` cria tabelas ausentes com `sequelize.sync()` e popula os dados fictícios. Ele não reseta reservas nem deve ser executado em bancos reais compartilhados. Para produção utilize migrações Sequelize e separe bancos por ambiente.

### Spotify (opcional)

1. Registre um aplicativo em <https://developer.spotify.com/dashboard>.
2. Cadastre a URI de retorno **exatamente** `http://127.0.0.1:5173/spotify/callback` (o Spotify não aceita `http://localhost` como redirect HTTP).
3. Configure `VITE_SPOTIFY_CLIENT_ID=...` no `.env` **somente do frontend** e reinicie o Vite.
4. No Alfred, abra **Seu Ritmo** e autorize a leitura `user-top-read`. O frontend usa PKCE e armazena apenas um access token temporário em `sessionStorage` durante a sessão.
5. **Limitações oficiais:** o Spotify restringe apps em *Development Mode*, podendo exigir Premium e limitar usuários autorizados. A API não assegura gêneros de artistas no retorno. Se não forem fornecidos, escolha gêneros manualmente. A integração depende das permissões concedidas ao aplicativo pelo Spotify.

Referências oficiais:
- <https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow>
- <https://developer.spotify.com/documentation/web-api/concepts/redirect_uri>
- <https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks>
- <https://developer.spotify.com/blog/2026-02-06-update-on-developer-access-and-platform-security>

### Apple Music (etapa futura)

É necessário configurar **MusicKit**, gerar um *developer token* assinado no backend com credenciais Apple Developer, solicitar autorização do usuário e obter o **Music User Token**, então consultar históricos ou recomendações oficiais. Nunca incluir chave privada Apple no frontend.

Referências: <https://developer.apple.com/documentation/applemusicapi/> e <https://developer.apple.com/documentation/applemusicapi/get-v1-me-recent-played-tracks>.

## Endpoints da API

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api` | Status |
| POST | `/api/register` | Cadastro |
| POST | `/api/login` | Login JWT |
| GET | `/api/me` | Perfil autenticado |
| GET | `/api/events` | Lista eventos futuros, filtros opcionais `city`, `category`, `q` |
| GET | `/api/events/:id` | Detalhes e lotes |
| GET | `/api/venues?city=Joinville` | Locais |
| GET | `/api/venues/:id/events` | Próximos eventos no local |
| GET | `/api/orders` | Reservas fictícias do usuário autenticado |
| POST | `/api/orders/demo` | Simular reserva com `{ "ticketLotId": 11, "quantity": 2 }` |

Rotas `/api/me` e `/api/orders` requerem `Authorization: Bearer <JWT>`.

## Modelo de dados

- `users` (1) → (N) `orders`
- `venues` (1) → (N) `events`
- `events` (1) → (N) `ticket_lots`
- `events` (1) → (N) `orders`
- `ticket_lots` (1) → (N) `orders`

O controle de lotes em `/orders/demo` atualiza o saldo disponível somente quando há saldo suficiente, dentro de uma transação. A demonstração ainda não trata expiração de reservas e **não deve ser usada para comercialização real**.

## Próximos passos para uma versão comercial

- Painel de organizadores com CRUD de locais, eventos, lote e imagens com uploads seguros;
- Integração com sistema de pagamento (checkout, webhook idempotente, devoluções) e geração de ingresso somente após confirmação;
- QR Code assinado e conferência na portaria, controle de fraudes e auditoria;
- Políticas LGPD (consentimento geolocalização e música, exclusão de dados, retenção, privacidade), logs e rate limiting;
- Cadastro e localização de eventos reais, geocodificação confiável e filtros por raio/bairro;
- Integração MusicKit/Apple Music e melhorias no algoritmo de recomendação, com consentimento e privilégios mínimos;
- Testes E2E, migrações, testes de concorrência, documentação de acessibilidade.

## Validação no ambiente de geração

A sintaxe de todos os arquivos `.js` foi verificada com `node --check`. O ambiente não possuía cache das dependências NPM nem acesso funcional ao registry; **não foi possível instalar os pacotes, compilar o Vue ou executar a API com banco**. Após `npm install` em um computador com internet e MySQL configurado, rodar `npm run build` e fazer os testes manuais.
