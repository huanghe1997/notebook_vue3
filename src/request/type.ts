export type Response<T = unknown> = {
  code?: number;
  status?: number;
  msg?: string;
  data: T;
};
