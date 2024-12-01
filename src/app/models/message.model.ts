export interface Message {
  response?: 'success' | 'error';
  message: string;
  canShow: boolean;
}
