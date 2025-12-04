import * as userRepository from '../repositories/userRepository';
import { CreateUserDTO } from '../models/userModel';

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