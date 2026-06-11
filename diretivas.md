# Diretivas do projeto

Este documento registra as intenções e princípios que guiam o desenvolvimento do inftools. Serve como referência para mim mesmo e para qualquer pessoa que venha contribuir.

---

## Princípio central: local-first

Toda ferramenta deve funcionar sem servidor. O navegador é o ambiente de execução. O usuário não precisa criar conta, fazer login, nem confiar que alguém vai tratar bem os dados dele.

Isso significa:

- **Processamento no cliente.** Canvas, redimensionamento, exportação, filtros — tudo acontece no navegador via JavaScript/WebAssembly.
- **Sem upload implícito.** Nenhuma imagem, texto ou arquivo do usuário deve ser enviado para um servidor externo, mesmo que seja "só para processar".
- **Sem analytics de comportamento.** Sem rastreamento de cliques, sem heatmaps, sem scripts de métricas que enviam dados para terceiros.
- **Sem login.** Se uma ferramenta precisar persistir preferências do usuário, usa `localStorage` — que fica no dispositivo do usuário, não num banco de dados meu.

---

## Dependências externas: critérios de aceitação

Algumas libs precisam ser carregadas de CDN (porque empacotar tudo tornaria o projeto pesado e difícil de manter). A regra é:

1. **A lib não pode receber conteúdo do usuário.** CDNs só entregam código estático. A requisição vai ao servidor do CDN, mas nenhum dado criado pelo usuário vai junto.
2. **Fontes do Google Fonts** são aceitáveis — a requisição expõe qual fonte foi carregada, não o que o usuário escreveu.
3. **Se algum dia uma lib precisar enviar dados para funcionar** (ex: API de IA na nuvem), isso deve ser explícito, opt-in, com aviso claro antes de acontecer.

Dependências atuais e justificativa:
- **Fabric.js** (CDN) — engine de canvas. Não recebe dados do usuário.
- **JSZip** (CDN) — compactação de arquivos no cliente. Não recebe dados do usuário.
- **FileSaver.js** (CDN) — trigger de download. Não recebe dados do usuário.
- **Google Fonts** (CDN) — tipografia. Exposição mínima (nome da fonte).

---

## Estrutura do projeto

O projeto vive em uma única pasta na raiz do repositório, sem build step. Isso é intencional:

- Qualquer pessoa pode clonar e abrir `index.html` sem instalar nada.
- GitHub Pages funciona direto da raiz sem configuração de pasta de build.
- Ferramentas novas são arquivos HTML independentes linkados pelo hub.

Cada ferramenta é um HTML autocontido (ou um HTML + CSS + JS separados quando o arquivo crescer demais). Não há framework, não há bundler, não há processo de build. Isso reduz a barreira de entrada e elimina uma classe inteira de problemas de dependência.

---

## Tom e foco

As ferramentas são feitas **para mim** primeiro. Se forem úteis para outros criadores, ótimo. Mas o critério de prioridade é: o que eu uso no dia a dia?

O hub (index.html) é um painel simples de cards. Sem marketing, sem landing page exagerada. Cada card vai direto ao ponto: o que a ferramenta faz e um link para ela.

---

## O que este projeto não é

- Não é um SaaS. Não há plano pago, não há freemium.
- Não é uma plataforma para outros desenvolvedores publicarem ferramentas.
- Não é uma alternativa a Canva, Adobe ou qualquer produto comercial. É uma coleção de atalhos práticos para casos de uso específicos meus.

---

## Adicionando novas ferramentas

Checklist antes de adicionar uma ferramenta nova:

- [ ] Roda 100% no cliente sem servidor?
- [ ] Se carrega lib externa, a lib não recebe conteúdo do usuário?
- [ ] Tem um único arquivo de entrada (`.html`) que pode ser linkado pelo hub?
- [ ] O card no `index.html` descreve claramente o que a ferramenta faz em uma linha?
- [ ] O README foi atualizado com a nova ferramenta?
