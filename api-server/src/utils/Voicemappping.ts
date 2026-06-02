import { FullName } from "../constants/common";

export const getShortVoiceName = (voiceName: string): string => {
  return FullName[voiceName as keyof typeof FullName] || voiceName;
};