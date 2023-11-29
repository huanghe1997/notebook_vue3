import requestInstance from '@/request';

export async function getTasks(data: { userId: number }): Promise<any> {
  return requestInstance(`/task?userId=${data.userId}`, { method: 'GET' });
}
export async function removeTask(data: { id: number }) {
  return requestInstance(`/task?id=${data.id}`, { method: 'DELETE' });
}
export async function insertTask(data: { userId: number; taskName: string; day: string }) {
  return requestInstance('/task', { method: 'POST', data });
}
