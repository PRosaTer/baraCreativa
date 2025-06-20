import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entidades/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async encontrarPorId(id: number): Promise<Usuario | null> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    return usuario || null;
  }

  async encontrarPorCorreo(correoElectronico: string): Promise<Usuario | null> {
    const usuario = await this.usuariosRepository.findOne({ where: { correoElectronico } });
    return usuario || null;
  }


  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return usuario;
  }


  async create(usuarioData: Partial<Usuario>): Promise<Usuario> {
    const nuevoUsuario = this.usuariosRepository.create(usuarioData);
    return this.usuariosRepository.save(nuevoUsuario);
  }


  async update(id: number, usuarioData: Partial<Usuario>): Promise<Usuario> {
    const resultado = await this.usuariosRepository.update(id, usuarioData);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return this.findOne(id);
  }


  async remove(id: number): Promise<void> {
    const resultado = await this.usuariosRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
  }
}