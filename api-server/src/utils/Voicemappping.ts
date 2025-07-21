import { FullName, VoiceGender, VoiceLanguage } from "../constants/common";

export const getShortVoiceName = (voiceName: string): string => {
  return FullName[voiceName as keyof typeof FullName] || voiceName;
};