import requestInstance from '@/request';
//新增笔记本接口
export async function addNotebook(data: {
  notebookName: string;
  notebookImageUrl: string;
  userId: number;
}): Promise<any> {
  return requestInstance('/notebook', { data, method: 'POST' });
}
// 删除笔记本接口
export async function deleteNotebook(data: { id: number }): Promise<any> {
  return requestInstance(`/notebook?id=${data.id}`, { method: 'DELETE' });
}
//查询笔记本列表
export async function queryNotebooks(data: { userId: number }) {
  return requestInstance(`/notebook?userId=${data.userId}`, { method: 'GET' });
}
//查询笔记本标签
export async function queryName(data: { userId: number }) {
  return requestInstance(`/notebook/name?userId=${data.userId}`, { method: 'GET' });
}
//修改笔记本
export async function updateNotebook(data: {
  id: number;
  notebookName: string;
  notebookImageUrl: string;
  userId: number;
}) {
  return requestInstance('/notebook', { data, method: 'PUT' });
}
