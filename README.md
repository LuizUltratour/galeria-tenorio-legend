# Modern Galeria — Tenório Legend

Galeria de imagens/plantas/vídeos para injeção via script no 3DVista, hospedada no AWS S3.

**Projeto:** Tenório Legend
**Tema:** verde imersivo (`#002E1D` / `#EAFFF7`)

---

## URLs de produção

| Arquivo | URL |
|---------|-----|
| Galeria | `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/tenorio/galeria-legend/index.html` |
| Vídeos  | `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/tenorio/galeria-legend/video-gallery.html` |
| Script  | `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/tenorio/galeria-legend/inject.js` |

**S3 path:** `s3://skylineip/Tour Virtual/tenorio/galeria-legend/`

---

## Estrutura de arquivos

```
galeria/  (Tenório Legend)
├── index.html              ← galeria de imagens + plantas (auto-suficiente)
├── video-gallery.html      ← galeria de vídeos
├── diferenciais.html       ← página de Diferenciais (texto; abre pelo botão da galeria ou pelo 3DVista)
├── inject.js               ← loader leve para injeção no 3DVista
├── deploy.ps1              ← deploy para o S3 (Windows; sync)
├── generate_thumbs.ps1     ← gerador de thumbnails (Windows/GDI+, sem deps)
├── generate_thumbs.py      ← gerador alternativo (Python + Pillow)
└── assets/
    ├── IMAGENS/              ← renders: áreas comuns e apartamento decorado (arquivos soltos)
    ├── PLANTAS HUMANIZADAS/  ← plantas (jpg/png)
    ├── videos/               ← .mp4 (gitignored; direto no S3)
    ├── BOOK-PRINT.pdf        ← book de referência (gitignored, não sobe ao S3)
    └── thumbs/               ← gerado automaticamente (espelha a árvore, .jpg)
```

> **Pastas = categorias.** Os nomes das pastas em `assets/` definem as categorias/subcategorias da galeria. O S3 é case-sensitive: os caminhos em `index.html` devem ter exatamente o mesmo case das pastas/arquivos (ex.: `assets/IMAGENS/...`). Espaços são aceitos (o navegador codifica a URL).

---

## Categorias da galeria

### Modo `imagens`

| Categoria | Label | Origem |
|-----------|-------|--------|
| `fachada` | Fachada | `assets/IMAGENS/` (31–33 e Inserção) |
| `areas-comuns` | Áreas Comuns | `assets/IMAGENS/` |
| `apto-3` | Apartamento 3 Quartos | `assets/IMAGENS/` (01–06) |
| `apto-4` | Apartamento 4 Quartos | `assets/IMAGENS/` (07–13) |
| `mapa` | Localização | `assets/IMAGENS/` (34) |

### Modo `plantas`

Lista única com todas as plantas de `assets/PLANTAS HUMANIZADAS/` (sem sub-filtros). Cada item é declarado em `GALLERY_CONFIG.items` no `index.html` com `category:'plantas', isPlant:true`.

---

## Botão e página Diferenciais

- **Botão na galeria:** `#btn-dif` ("Diferenciais"), no cabeçalho do `index.html`. Ao clicar, abre `diferenciais.html` num overlay (`#dif-overlay`) por cima da galeria; o botão fechar (ou Esc) da página volta para a galeria (mensagem `closeGallery` tratada só dentro da galeria).
- **Função dedicada no 3DVista:** `AbrirDiferenciais(1)` abre a página sozinha, em tela cheia; `AbrirDiferenciais(0)` fecha (veja *Integração 3DVista*).
- **Conteúdo:** os textos ficam direto em `diferenciais.html` (cartões "Segurança e conforto" e "Tecnologia e sustentabilidade").

---

## Thumbnails

Todo `src` da grade usa um `thumb` leve (**900 px, JPEG q82**, achatado sobre branco).
Geração **sem dependências** no Windows via GDI+:

```powershell
# Gera apenas os que faltam / desatualizados
./generate_thumbs.ps1

# Regenera todos
./generate_thumbs.ps1 -Force
```

O script espelha `assets/` em `assets/thumbs/` (sempre `.jpg`, mesmo caminho/case),
ignora `thumbs/`, `videos/` e o PDF.

> Alternativa multiplataforma: `python generate_thumbs.py` (requer Python + Pillow).

---

## Deploy AWS S3

> **Windows:** use o script pronto `./deploy.ps1` (faz o sync completo + `cache-control` no HTML/JS).
> Requer **AWS CLI** instalado e credenciais configuradas (`aws configure`) uma única vez.

### Sync completo

```bash
aws s3 sync . "s3://skylineip/Tour Virtual/tenorio/galeria-legend/" \
  --exclude ".git/*" --exclude ".claude/*" --exclude "*.py" \
  --exclude "README.md" --exclude ".gitattributes" --exclude "*.md" \
  --exclude "deploy.ps1" --exclude "*.pdf" \
  --delete
```

### Atualizar só index.html e inject.js

```bash
aws s3 cp index.html "s3://skylineip/Tour Virtual/tenorio/galeria-legend/index.html" \
  --cache-control "no-cache,no-store,must-revalidate"

aws s3 cp inject.js "s3://skylineip/Tour Virtual/tenorio/galeria-legend/inject.js" \
  --cache-control "no-cache,no-store,must-revalidate"
```

> **`--cache-control "no-cache,no-store,must-revalidate"`** — essencial para garantir que o browser nunca sirva uma versão cacheada do script ou da galeria.

---

## Integração 3DVista

### Passo 1 — Loader (colocar no JavaScript global do projeto)

```js
(function(){
  var s = document.createElement('script');
  s.src = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/tenorio/galeria-legend/inject.js?v=' + Date.now();
  document.head.appendChild(s);
})();
```

> **`?v=` + `Date.now()`** — cache-busting: força o browser a baixar sempre a versão mais recente do script, evitando que o 3DVista sirva uma versão antiga em cache.

### Passo 2 — Acionar nos hotspots/botões

```js
// Abre galeria de imagens
GaleriaImagens(1);

// Fecha galeria de imagens
GaleriaImagens(0);

// Abre galeria de plantas
GaleriaPlantas(1);

// Fecha galeria de plantas
GaleriaPlantas(0);

// Abre a galeria de vídeos
AbrirGaleriaVideos(1);

// Fecha a galeria de vídeos
AbrirGaleriaVideos(0);

// Abre a página de Diferenciais
AbrirDiferenciais(1);

// Fecha a página de Diferenciais
AbrirDiferenciais(0);
```

---

## Cores e tipografia

Tema **marrom imersivo** do Tenório Legend:

| Token CSS | Valor | Papel |
|-----------|-------|-------|
| `--bg` (fundo) | `#002E1D` | Verde-escuro principal (fundo) — cor primária |
| `--surface` | `#073C28` | Superfície de card |
| `--dark` (foreground) | `#EAFFF7` | Texto/ícones (verde-claro) — cor secundária |
| `--accent` | `#EAFFF7` | Destaque / estado ativo (usa a secundária sobre fundo escuro) |
| Fonte títulos | Cormorant Garamond | — |
| Fonte UI | Inter | — |

> Plantas técnicas mantêm **fundo claro** no card (`#EAFFF7`, para legibilidade do desenho), com texto verde-escuro (`#002E1D`) — a mesma dupla primária/secundária, com os papéis invertidos.
