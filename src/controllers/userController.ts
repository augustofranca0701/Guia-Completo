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