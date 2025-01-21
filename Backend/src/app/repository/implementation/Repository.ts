import { Prisma, PrismaClient } from "@prisma/client";
import { IRepository } from "../IRepository";
import ErrorHandler from "../../utils/ErrorHandler";
import { NOT_FOUND } from "../../utils/Http-Status";

const prisma = new PrismaClient();

export class Repository<T> implements IRepository<T> {
  private model: any;

  constructor(modelName: string) {
    if (!(prisma as any)[modelName]) {
      throw new Error(`Model ${modelName} does not exist.`);
    }
    this.model = (prisma as any)[modelName];
  }

  async findMany(options?: any): Promise<T[]> {
    const entities = await this.model.findMany(options);
    if(entities.length === 0){
      return [];
    }
    return entities;
  }

  async findUnique(options: any): Promise<T | null> { return await this.model.findUnique(options);}

  async findById(id: number): Promise<T | null> {
    const entity = await this.model.findUnique({
        where: { id },
      });
      if(!entity) throw new ErrorHandler("Entity not found", NOT_FOUND);
    return entity;
  }

  async create(data:any): Promise<T> {
    return await this.model.create({ data });
  }

  async update(options: any, data: Partial<T>): Promise<T> {
    if (!options?.where || !options.where.id) {
      throw new Error("Invalid options: ID is required to update.");
    }

    return await this.model.update({
      where: options.where,
      data,
    });
  }

  async updateMany(
    options: any, data: Partial<T>
  ): Promise<Prisma.BatchPayload | null> {
    if (!options?.where) {
      throw new Error("Invalid options: A filter condition is required to update multiple records.");
    }

    return await this.model.updateMany({where:options.where, data});
  }

  async delete(options: any): Promise<T | null> {
    if (!options?.where || !options.where.id) {
      throw new Error("Invalid options: ID is required to delete.");
    }

    return await this.model.delete(options);
  }
  async deleteMany(options: any): Promise<Prisma.BatchPayload | null> {
    return await this.model.deleteMany(options);
  }
}
