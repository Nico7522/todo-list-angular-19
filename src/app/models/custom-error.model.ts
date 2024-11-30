export interface IError extends ErrorOptions {
  status?: number;
}

export class CustomError extends Error {
  status?: number;
  constructor(message: string, options?: IError) {
    super(message, { cause: options?.cause });
    this.status = options?.status;
  }
}
