export interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  surname?: string;
  gender?: 'female' | 'male';
  country?: string;
  picture?: string;
}
