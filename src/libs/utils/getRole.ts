export const getRole = (roleId: number) => {
  switch (roleId) {
    case 1:
      return "Koordinator TU";
    case 2:
      return "Pimpinan";
    case 3:
      return "Arsiparis Surat Masuk";
    case 4:
      return "Arsiparis Surat Keluar";
    case 5:
      return "User General";
    default:
      return "User Unknown";
  }
};
