export const transformData = (data: any) => {
  if (!Array.isArray(data)) {
    console.error("Data harus berupa array");
    return [];
  }

  return data.map((data: any, index: number) => ({
    key: `${data.id}-${index}`,
    no: index + 1,
    ...data,
  }));
};
