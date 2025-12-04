# Como criar e configurar um `.gitignore` no seu projeto

O arquivo `.gitignore` serve para indicar ao Git quais arquivos **não devem ser ersionados**.
Isso evita enviar para o repositório arquivos sensíveis, pesados ou gerados tomaticamente.

---

## Passo 1 — Criar o arquivo `.gitignore`

No diretório raiz do seu projeto, crie o arquivo:

```bash
.gitignore
```

- Ou crie manualmente pelo VS Code:
- Clique com botão direito na pasta → **New File**  
- Nomeie como: `.gitignore`

---

## Passo 2 — O que colocar dentro de um `.gitignore`?

### 🔹 1. Pastas geradas automaticamente

```bash
/node_modules
/dist
/build
```

Essas pastas **não devem ir para o Git**, pois podem ser recriadas.

---

### 🔹 2. Arquivos de ambiente (NUNCA versionar)

```
.env
.env.local
.env.development
.env.production
```

Esses arquivos contêm **senhas**, **tokens**, **dados privados**.

---

### 🔹 3. Logs e cache

```bash
*.log
npm-debug.log*
pids
*.pid
*.seed
*.pid.lock
```

---

### 🔹 4. Arquivos específicos do sistema operacional

```bash
.DS_Store   # macOS
Thumbs.db   # Windows
```

---

## 🔹 5. Arquivos temporários do editor

```bash
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
```

Isso ignora toda a pasta `.vscode`, **exceto** arquivos úteis compartilháveis.

---

## Passo 3 — Confirmar que o `.gitignore` está funcionando

Depois de criar o arquivo, execute:

```bash
git status
```

Se algo que você queria ignorar ainda aparecer, faça:

```bash
git rm -r --cached nome-da-pasta-ou-arquivo
```

Isso retira do Git, mas mantém o arquivo no seu computador.

---

## Exemplo completo de `.gitignore` para projetos Node.js + TypeScript

```bash
# Dependências
/node_modules

# Build
/dist

# Ambiente
.env

# Logs
*.log
npm-debug.log*

# VSCode
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json

# SO
.DS_Store
Thumbs.db
```

---
