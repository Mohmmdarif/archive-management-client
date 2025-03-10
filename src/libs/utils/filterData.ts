export const filterData = <T extends Record<string, any>>(
  data: T[],
  searchQuery: string,
  fields: string[]
): T[] => {
  if (!searchQuery) return data;

  return data.filter((item) =>
    fields.some((field) =>
      item[field].toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
};
