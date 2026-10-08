// Объявления для CSS модулей
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Объявления для изображений
declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}