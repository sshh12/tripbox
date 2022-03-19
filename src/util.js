export let tagToColor = (tag) => {
  const colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#3F51B5",
    "#03A9F4",
    "#00BCD4",
    "#4CAF50",
    "#CDDC39",
    "#FFEB3B",
    "#607D8B",
  ];
  const hash = tag.split("").reduce((acc, val) => val.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

export let tagToLabel = (tag) => {
  if (tag.includes(":")) {
    return tag.split(":")[1];
  }
  return tag;
};
