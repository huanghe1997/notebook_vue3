import type { ToolbarNames } from 'md-editor-v3';
export type NotebookType = {
  notebookId?: number;
  notebookName?: string;
  notebookCount?: number;
  notebookImageUrl?: string | undefined;
};
export type NotebookListType = {
  id?: number;
  notebookName?: string;
  backgroundColor?: string;
  showButton?: boolean;
  notebookImageUrl?: string | undefined;
  notebookCount?: number;
  userId: number | undefined;
};
export interface BookDialogType {
  dialogVisible: boolean;
  formData: {
    notebookName: string | undefined;
    id: number | undefined;
    notebookImageUrl: string | undefined;
    userId: number;
  };
  isEdit: boolean;
}
export type NoteListProps = {
  notebook: NotebookType;
};
export type toolbarsToolProps = {
  toolbars: ToolbarNames[];
};
export const tools: ToolbarNames[] = [
  'bold',
  'underline',
  'italic',
  '-',
  'strikeThrough',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task', // ^2.4.0
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  '=',
  'pageFullscreen',
  'fullscreen',
  'catalog',
];
export type task = {
  id: number;
  taskName: string;
  day: string;
};
export type taskReactiveProps = {
  openInput: boolean;
  tasks: task[];
  currentDate: string;
  currentInputValue: string;
};
