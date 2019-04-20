// import circle from 'assets/circle';
// import circlePin from 'assets/circlePin';
// import homePin from 'assets/homePin';
import marker from 'assets/marker';
// import officeBuilding from 'assets/officeBuilding';
// import pinOutline from 'assets/pinOutline';

const images = [
  // ['circle', circle],
  // ['circlePin', circlePin],
  // ['homePin', homePin],
  ['marker', marker],
  // ['officeBuilding', officeBuilding],
  // ['pinOutline', pinOutline],
];

export default images.map(([title, svg]) => {
  const image = new Image();
  image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(svg);
  return [title, image];
});
