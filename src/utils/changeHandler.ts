export const createChangeHandler = <T extends Record<string, any>>(
  setter: React.Dispatch<React.SetStateAction<T>>
) => {
  return (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
};
