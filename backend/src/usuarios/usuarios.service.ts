import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entidades/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async encontrarPorId(id: number): Promise<Usuario | null> {
    return await this.usuariosRepository.findOne({ where: { id } });
  }

  async encontrarPorCorreo(correoElectronico: string): Promise<Usuario | null> {
    return await this.usuariosRepository.findOne({ where: { correoElectronico } });
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
    if (usuarioData.password) {
      const salt = await bcrypt.genSalt();
      usuarioData.password = await bcrypt.hash(usuarioData.password, salt);
    }

    const nuevoUsuario = this.usuariosRepository.create(usuarioData);
    return this.usuariosRepository.save(nuevoUsuario);
  }

  async update(id: number, usuarioData: Partial<Usuario>): Promise<Usuario> {
    const usuarioExistente = await this.encontrarPorId(id);
    if (!usuarioExistente) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }


    if (usuarioData.password) {
      const salt = await bcrypt.genSalt();
      usuarioData.password = await bcrypt.hash(usuarioData.password, salt);
    }

 
    if (usuarioData.tipoUsuario) {
      usuarioData.esAdmin = usuarioData.tipoUsuario === 'Admin';
    }

    await this.usuariosRepository.update(id, usuarioData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const resultado = await this.usuariosRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
  }

  async actualizarEstado(id: number, conectado: boolean): Promise<void> {
    const resultado = await this.usuariosRepository.update(id, { estaConectado: conectado });
    if (resultado.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado para actualizar estado.`);
    }
    console.log(`UsuariosService: actualizado estado usuario ${id} a ${conectado}`);
  }
}
