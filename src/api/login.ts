import requestInstance from '@/request/index.ts';
//登录接口
export async function loginUser(data: { name: string; password: string }): Promise<Promise<any>> {
  return requestInstance('/auth/login', { data, method: 'POST' }).then((res: any) => res);
}
//注册接口
export async function registerUser(data: {
  name: string;
  password: string;
  enterPassword: string;
}): Promise<any> {
  return requestInstance('/auth/register', { data, method: 'POST' });
}
//查询个人信息接口

export async function getUser(data: { userId: number }): Promise<any> {
  return requestInstance(`/auth/getUser?userId=${data.userId}`, { data, method: 'GET' });
}

//修改个人信息接口
export async function updateUser(data: {
  id: number;
  nickName: string;
  sex: string | undefined;
  imageUrl: string;
  address: string;
}): Promise<any> {
  return requestInstance('/auth', { data, method: 'PUT' });
}
