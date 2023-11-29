export type NoteMessageProps = {
  noteId: number | undefined;
  noteTime: string | undefined;
  noteTitle: string;
  nickName: string; //用户别名
  notebookName: string;
  notebookImageUrl: string | undefined;
  noteMd: string;
  imageUrl: string | undefined;
};
