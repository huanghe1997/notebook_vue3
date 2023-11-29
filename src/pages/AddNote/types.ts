import { ToolbarNames } from 'md-editor-v3';

export type OptionsProps = {
  value: string;
  label: string;
};
export type NoteReactiveProps = {
  note: {
    noteTitle: string;
    noteMd: string | undefined;
    userId: number;
    notebookId: number | undefined;
    noteTime: number | undefined;
  };
  options?: OptionsProps[] | undefined;
};
export const toolbar: ToolbarNames[] = [
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
  'preview',
  'htmlPreview',
  'catalog',
];
