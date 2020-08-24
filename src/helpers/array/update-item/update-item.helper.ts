const updateItem = <T>(items: T[], item: T, key: keyof T) => {
  const updatedItems = items.map((it) => (it[key] === item[key] ? item : it));

  return updatedItems;
};

export { updateItem };
