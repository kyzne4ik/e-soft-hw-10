export const isVoid = (fields) => {
  const patch = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== undefined),
  );
  return Object.keys(patch).length === 0;
};
