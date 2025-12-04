import pool from '../config/db';
import { User, CreateUserDTO } from '../models/userModel';

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
  return result.rows[0]!;
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