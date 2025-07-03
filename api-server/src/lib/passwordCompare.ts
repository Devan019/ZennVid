import bcrypt from "bcrypt";
export const passwordCompare = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
}