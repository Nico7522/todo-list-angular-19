export function getAssociatedImage(title: string) {
  let imgUrl = '';
  switch (title) {
    case 'Faire le ménage':
      imgUrl = 'cleaning.jpg';
      break;
    case 'Faire les courses':
      imgUrl = 'food-shop.webp';
      break;
    case 'Tondre la pelouse':
      imgUrl = 'tondeuse.jpg';
      break;
    case 'Ranger la chambre':
      imgUrl = 'rangement.jpg';
      break;
    case 'Faire ses devoirs':
      imgUrl = 'study.jpeg';
      break;
    default:
      break;
  }

  return imgUrl;
}
