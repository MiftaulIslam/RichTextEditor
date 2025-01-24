import { Prisma } from "@prisma/client";

export interface IRepository<T> {
    findMany(options?: any): Promise<T[]>;
    findUnique(options: any): Promise<T | null>;
    findById(id:number): Promise<T | null>;
    findOne(options: any): Promise<T | null>;
    create(data: T): Promise<T>;
    update(options: any, data: Partial<T>): Promise<T>;
    updateMany(options: any, data: Partial<T>): Promise<Prisma.BatchPayload | null>;
    delete(options: any): Promise<T | null>;
    deleteMany(options: any): Promise<Prisma.BatchPayload | null>;
    count(params: {
      where?: Record<string, any>;
      include?: Record<string, any>;
    }): Promise<number>;
  }