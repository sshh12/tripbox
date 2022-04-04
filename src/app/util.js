export let tagIdxToColor = (idx) => {
  const colors = [
    "#F44336",
    "#E91E63",
    "#673AB7",
    "#3F51B5",
    "#3F51B5",
    "#03A9F4",
    "#00BCD4",
    "#4CAF50",
    "#CDDC39",
    "#607D8B",
  ];
  return colors[idx % colors.length];
};

export let tagToLabel = (tag) => {
  if (tag.includes(":")) {
    return tag.split(":")[1];
  }
  return tag;
};
