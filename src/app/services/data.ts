import { User } from '../models/user.model';

export const titles = [
  'Faire les courses',
  'Faire le ménage',
  'tondre la pelouse',
  'ranger la chambre',
  'faire ses devoirs',
];
export const images = [
  'food-shop.webp',
  'cleaning.jpg',
  'rangement.jpg',
  'tondeuse.jpg',
  'study.jpeg',
];
export const completed = [false, true];

export const users: User[] = [
  {
    id: 1,
    username: 'John',
  },
  {
    id: 2,
    username: 'Nicolas',
  },
  {
    id: 3,
    username: 'Anne',
  },
  {
    id: 4,
    username: 'Jean',
  },
  {
    id: 5,
    username: 'Pierre',
  },
];
