const getInitial = (name: string) => name.charAt(0).toUpperCase();

const getColor = (initial: string) => {
  const colorMap: { [key: string]: string } = {
    A: "#FF5733", // Merah
    B: "#33FF57", // Hijau
    C: "#3357FF", // Biru
    D: "#FF33A1", // Pink
    E: "#FFC300", // Kuning
    F: "#DAF7A6", // Hijau Muda
    G: "#581845", // Ungu Gelap
    H: "#900C3F", // Merah Gelap
    I: "#C70039", // Merah Tua
    J: "#FF5733", // Oranye
    K: "#FFC300", // Kuning
    L: "#DAF7A6", // Hijau Muda
    M: "#FF33A1", // Pink
    N: "#33FF57", // Hijau
    O: "#3357FF", // Biru
    P: "#581845", // Ungu Gelap
    Q: "#900C3F", // Merah Gelap
    R: "#C70039", // Merah Tua
    S: "#FF5733", // Oranye
    T: "#FFC300", // Kuning
    U: "#DAF7A6", // Hijau Muda
    V: "#581845", // Ungu Gelap
    W: "#900C3F", // Merah Gelap
    X: "#C70039", // Merah Tua
    Y: "#FF5733", // Oranye
    Z: "#FFC300", // Kuning
  };

  return colorMap[initial] || "#C1C7CD";
};

export { getInitial, getColor };
