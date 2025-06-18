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

export const getJabatan = (jabatanId: string) => {
  switch (jabatanId) {
    case "koordinator_tu":
      return "Koordinator TU";
    case "dekan":
      return "Dekan";
    case "wakil_dekan_1":
      return "Wakil Dekan I";
    case "wakil_dekan_2":
      return "Wakil Dekan II";
    case "wakil_dekan_3":
      return "Wakil Dekan III";
    case "kaprodi":
      return "Kaprodi";
    case "arsiparis_surat_masuk":
      return "Arsiparis Surat Masuk";
    case "arsiparis_surat_keluar":
      return "Arsiparis Surat Keluar";
    case "staff":
      return "Staff";
    default:
      return "User Unknown";
  }
};
