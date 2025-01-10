export interface IRepository<T> {
    findMany(options?: any): Promise<T[]>;
    findUnique(options: any): Promise<T | null>;
    findById(id:number): Promise<T | null>;
    create(data: T): Promise<T>;
    update(options: any, data: Partial<T>): Promise<T>;
    delete(options: any): Promise<T | null>;
  }