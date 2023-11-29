import requestInstance from '@/request';
//新增笔记
export function addNote(data: {
  noteTitle: string;
  noteMd: string | undefined;
  userId: number;
  notebookId: number | undefined;
}): Promise<any> {
  return requestInstance('/note', { data, method: 'POST' });
}
//查询所有笔记
export function queryNoteList(data: { userId: number; notebookId: number }): Promise<any> {
  return requestInstance(`/note?userId=${data.userId}&notebookId=${data.notebookId}`, {
    method: 'GET',
  });
}
//删除笔记
export function deleteNote(data: { id: number }): Promise<any> {
  return requestInstance(`/note?id=${data.id}`, { method: 'DELETE' });
}
//修改笔记
export async function updateNote(data: {
  id: number;
  noteTitle: string;
  noteMd: string;
  userId: number;
  notebookId: number;
}) {
  return requestInstance('/note', { data, method: 'PUT' });
}
//查询所有用户笔记
export async function getNotes(): Promise<any> {
  return requestInstance('/note/getNotes', { method: 'GET' });
}
//查询特定笔记
export async function searchNotes(data: { searchValue: string }): Promise<any> {
  return requestInstance(`/note/search?searchValue=${data.searchValue}`, { method: 'GET' });
}
