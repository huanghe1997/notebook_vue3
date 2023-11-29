import requestInstance from '@/request';

export function upload(data: { file: File }): Promise<any> {
  return requestInstance('/upload', {
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
