export const generateColors = (length) => {
  const colors = [];

  for (let i = 0; i < length; i++) {
    const color = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    colors.push(color);
  }

  return colors;
};
