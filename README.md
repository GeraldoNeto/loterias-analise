# 🎲 Análise de Loterias

Aplicação web para análise estatística das loterias brasileiras **Mega-Sena** e **Lotofácil**, com dados históricos em tempo real direto da API oficial da Caixa Econômica Federal.

## ✨ Funcionalidades

- **Dados ao vivo** — busca automática dos resultados mais recentes na API da Caixa
- **Frequência de dezenas** — visualização interativa com bolinhas coloridas por frequência histórica
- **Mapa de calor** — bolhas dimensionadas por frequência relativa de cada número
- **Análise de padrões** — soma dos números, proporção pares/ímpares, moldura/miolo e faixas estatísticas
- **Jogos sugeridos** — 6 apostas pré-montadas com diferentes critérios analíticos
- **Gerador inteligente** — cria jogos aleatórios ponderados pelo histórico de frequência, com validação de soma e exibição do custo estimado
- **Layout responsivo** — compatível com desktop e mobile

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [React](https://react.dev/) | 19.x | Interface de usuário |
| [Vite](https://vitejs.dev/) | 8.x | Build e servidor de desenvolvimento |
| [ESLint](https://eslint.org/) | 10.x | Qualidade de código |

**API utilizada:** Resultados da Caixa Econômica Federal

## ⚙️ Como Usar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/GeraldoNeto/loterias-analise.git
cd loterias-analise
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute em modo de desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### 4. Gere o build de produção

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
loterias-analise/
├── src/
│   ├── App.jsx               # Componente raiz
│   ├── LoteriasAnalise.jsx   # Componente principal com toda a lógica
│   ├── App.css               # Estilos do app
│   ├── index.css             # Estilos globais
│   └── assets/               # Recursos estáticos
├── public/                   # Arquivos públicos
├── index.html                # Entry point HTML
├── vite.config.js            # Configuração do Vite
└── package.json
```

## 📊 Sobre a Análise Estatística

> **Aviso:** Esta ferramenta tem fins exclusivamente **educacionais e analíticos**. Loterias são jogos de azar com probabilidades fixas — nenhuma análise estatística garante acerto ou melhora as chances reais de vitória.

A aplicação utiliza frequência histórica como critério de ponderação para geração de jogos, além de calcular:

- Distribuição de somas com faixas de probabilidade
- Padrão histórico de pares e ímpares
- Detecção de números consecutivos
- Probabilidades combinatórias estimadas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
