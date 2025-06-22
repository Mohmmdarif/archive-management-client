const getInitial = (name: string) => name.charAt(0).toUpperCase();

const getColor = (initial: string) => {
  const colorMap: { [key: string]: string } = {
    A: "#F44336", // Red
    B: "#E91E63", // Pink
    C: "#9C27B0", // Purple
    D: "#673AB7", // Deep Purple
    E: "#3F51B5", // Indigo
    F: "#2196F3", // Blue
    G: "#03A9F4", // Light Blue
    H: "#00BCD4", // Cyan
    I: "#009688", // Teal
    J: "#4CAF50", // Green
    K: "#8BC34A", // Light Green
    L: "#CDDC39", // Lime
    M: "#FFEB3B", // Yellow
    N: "#FFC107", // Amber
    O: "#FF9800", // Orange
    P: "#FF5722", // Deep Orange
    Q: "#795548", // Brown
    R: "#9E9E9E", // Grey
    S: "#607D8B", // Blue Grey
    T: "#B71C1C", // Dark Red
    U: "#1B5E20", // Dark Green
    V: "#0D47A1", // Dark Blue
    W: "#F57C00", // Orange Dark
    X: "#6D4C41", // Brown Dark
    Y: "#C51162", // Pink Dark
    Z: "#00B8D4", // Cyan Dark
  };

  return colorMap[initial] || "#C1C7CD";
};

const getColorFromNumber = (num: number): string => {
  const colors = [
    "#E91E63",
    "#9C27B0",
    "#FFEB3B",
    "#2196F3",
    "#4CAF50",
    "#FF5722",
    "#03A9F4",
    "#FFC107",
    "#8BC34A",
    "#00BCD4",
    "#3F51B5",
    "#009688",
    "#CDDC39",
    "#FF9800",
    "#795548",
    "#9E9E9E",
    "#607D8B",
    "#00E676",
  ];
  return colors[num % colors.length];
};

export { getInitial, getColor, getColorFromNumber };
