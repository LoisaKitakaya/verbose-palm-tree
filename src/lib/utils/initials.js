export const getInitialsOne = (name) => {
  const words = name.split(" ");

  if (words.length < 2) {
    throw new Error("Input must contain at least two words");
  }

  const initials = words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return initials;
};

export const getInitialsTwo = (firstName, lastName) => {
  return (firstName[0] + lastName[0]).toUpperCase();
};
