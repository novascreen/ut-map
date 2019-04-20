import marker from 'assets/marker';

const images = [
  ['marker', marker()],
  ['marker-construction', marker('#a0165f')],
  ['marker-preconstruction', marker('#333333')],
];

export default images.map(([title, svg]) => {
  const image = new Image();
  image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(svg);
  return [title, image];
});
