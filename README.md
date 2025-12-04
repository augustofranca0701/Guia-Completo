# Guia Completo — Backend com Node.js + TypeScript + Express + PostgreSQL + .env

Este documento descreve passo a passo como criar uma API REST profissional usando:
- Node.js
- TypeScript
- Express
- PostgreSQL com Pool
- Variáveis de ambiente via .env
- Estrutura de pastas organizada
- CRUD completo com rotas prefixadas

---

## 1. Criando o projeto

```bash
mkdir backend-pi
cd backend-pi

npm init -y

# Dependências principais
npm install express pg dotenv

# Dependências de desenvolvimento
npm install -D typescript ts-node-dev @types/node @types/express
```

---

## 2. Inicializar TypeScript

```bash
npx tsc --init
```

Ajuste no `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

---

## 3. Scripts do package.json

```json
"scripts": {
  "dev": "ts-node-dev --transpile-only --ignore-watch node_modules src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

Rodar o servidor em desenvolvimento:

```bash
npm run dev
```

---

## 4. Estrutura de pastas recomendada

```
backend-pi/
 ├── src/
 │   ├── config/
 │   │   └── db.ts
 │   ├── models/
 │   │   └── User.ts
 │   ├── repositories/
 │   │   └── userRepository.ts
 │   ├── services/
 │   │   └── userService.ts
 │   ├── controllers/
 │   │   └── userController.ts
 │   ├── routes/
 │   │   └── userRoutes.ts
 │   ├── app.ts
 │   └── server.ts
 ├── .env
 ├── package.json
 ├── tsconfig.json
```

---

## 5. Configurar variáveis de ambiente (.env)

```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
```

---

## 6. Pool do PostgreSQL (`src/config/db.ts`)

```ts
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

pool.on('connect', () => console.log('Conectado ao PostgreSQL.'));
pool.on('error', err => console.error('Erro no pool:', err));

export default pool;
```

---

## 7. Modelo de Usuário (`src/models/User.ts`)

```ts
export type User = {
  id: number;
  name: string;
  email: string;
  created_at?: Date;
};

export type CreateUserDTO = {
  name: string;
  email: string;
};
```

---

## 8. Repositório (`src/repositories/userRepository.ts`)

```ts
import pool from '../config/db';
import { User, CreateUserDTO } from '../models/User';

export async function findAll(): Promise<User[]> {
  const result = await pool.query<User>('SELECT * FROM users ORDER BY id');
  return result.rows;
}

export async function findById(id: number): Promise<User | null> {
  const result = await pool.query<User>('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] ?? null;
}

export async function create(data: CreateUserDTO): Promise<User> {
  const result = await pool.query<User>(
    `INSERT INTO users (name, email)
     VALUES ($1, $2)
     RETURNING *`,
    [data.name, data.email]
  );
  return result.rows[0];
}

export async function update(id: number, data: Partial<CreateUserDTO>): Promise<User | null> {
  const result = await pool.query<User>(
    `UPDATE users
     SET name = COALESCE($1, name),
         email = COALESCE($2, email)
     WHERE id = $3
     RETURNING *`,
    [data.name ?? null, data.email ?? null, id]
  );
  return result.rows[0] ?? null;
}

export async function remove(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return result.rowCount === 1;
}
```

---

## 9. Serviço (`src/services/userService.ts`)

```ts
import * as userRepository from '../repositories/userRepository';
import { CreateUserDTO } from '../models/User';

export async function getAllUsers() {
  return userRepository.findAll();
}

export async function getUserById(id: number) {
  return userRepository.findById(id);
}

export async function createUser(data: CreateUserDTO) {
  return userRepository.create(data);
}

export async function updateUser(id: number, data: Partial<CreateUserDTO>) {
  return userRepository.update(id, data);
}

export async function deleteUser(id: number) {
  return userRepository.remove(id);
}
```

---

## 10. Controller (`src/controllers/userController.ts`)

```ts
import { Request, Response } from 'express';
import * as userService from '../services/userService';

export async function getUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
}

export async function getUserById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await userService.getUserById(id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.status(200).json(user);
}

export async function createUser(req: Request, res: Response) {
  const { name, email } = req.body;
  const newUser = await userService.createUser({ name, email });
  res.status(201).json(newUser);
}

export async function updateUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const updated = await userService.updateUser(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.status(200).json(updated);
}

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const deleted = await userService.deleteUser(id);
  if (!deleted) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.status(200).json({ message: 'Usuário removido' });
}
```

---

## 11. Rotas (`src/routes/userRoutes.ts`)

```ts
import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
```

---

## 12. Arquivo principal (`src/app.ts`)

```ts
import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json());

// Prefixo de rotas
app.use('/api/users', userRoutes);

export default app;
```

---

## 13. Servidor (`src/server.ts`)

```ts
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

---

## 14. SQL para criar tabela Users

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 15. Testando no Thunder Client

**GET**
```
http://localhost:3000/api/users
```

**POST**
```json
{
  "name": "Augusto",
  "email": "augusto@example.com"
}
```

**PUT**
```json
{
  "name": "Augusto atualizado"
}
```

**DELETE**
```
http://localhost:3000/api/users/1
```

---
