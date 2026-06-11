# inftools

**[→ Abrir no navegador](https://thomazdiniz.github.io/inftools/inftools/)** · [Repositório](https://github.com/ThomazDiniz/inftools)

Ferramentas práticas para criadores de conteúdo e influencers, rodando 100% no navegador.

## O que é isso

inftools é uma coleção de utilitários feitos para facilitar o dia a dia de quem cria conteúdo. A ideia é ter um hub simples onde cada card leva a uma ferramenta diferente — sem precisar abrir dez abas, sem depender de serviços pagos, sem aprender interfaces complicadas.

O projeto é intencional em ser **local-first**: tudo roda no seu navegador, sem servidor, sem cadastro, sem nada que suba seus dados para algum lugar que você não conhece. Imagens, textos, configurações — tudo fica na sua máquina.

## Ferramentas disponíveis

### 🖼️ Thumbnail Maker
Editor de thumbnails com canvas. Adicione imagens, textos, formas, emojis e efeitos. Exporte em múltiplos formatos (YouTube, Instagram, TikTok etc.) de uma vez só, ou formato por formato. Tudo processado localmente via Fabric.js.

## Como usar

Pode rodar de três formas:

1. **GitHub Pages** — faça um fork, ative o Pages na raiz do repositório e acesse pelo link gerado.
2. **Localmente** — clone o repo e abra `index.html` direto no navegador (alguns recursos de imagem precisam de um servidor HTTP local por restrições de CORS).
3. **Com servidor local** — `npx serve .` ou `python -m http.server` na pasta do projeto.

## Estrutura

```
inftools/
├── index.html            ← hub principal
├── thumbnail_maker.html  ← Thumbnail Maker
├── thumbnail_maker.css
├── js/
│   ├── tm-constants.js
│   ├── tm-state.js
│   ├── tm-helpers.js
│   ├── tm-filters.js
│   ├── tm-canvas.js
│   ├── tm-layers.js
│   ├── tm-images.js
│   ├── tm-objects.js
│   ├── tm-panels.js
│   ├── tm-actions.js
│   └── tm-main.js
├── README.md
└── diretivas.md
```

## Próximas ferramentas

Sem data definida, mas ideias na fila:
- Editor de legendas / subtítulos
- Gerador de paleta de cores a partir de imagem
- Redimensionador de imagens em batch
- Gerador de bio para redes sociais

Sugestões são bem-vindas via issues.

## Dependências externas

As ferramentas carregam algumas libs via CDN (Fabric.js, JSZip, FileSaver) e fontes do Google Fonts. Essas requests vão para servidores externos, mas **nenhum dado de conteúdo** (imagens, textos que você digita) é enviado para fora. Veja `diretivas.md` para mais detalhes sobre as decisões de privacidade.

## Licença

MIT
