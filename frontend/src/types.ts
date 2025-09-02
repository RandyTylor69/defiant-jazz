import { User } from "firebase/auth";

export type LayoutContextType = {
  setIsLogging: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggingDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggingFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingLogDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingLogFinished: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggingFinished: boolean;
  isEditingLogFinished: boolean;
  logTarget: LogTargetType;
  setLogTarget: React.Dispatch<React.SetStateAction<LogTargetType>>;
  uid: string | undefined;
  displayName: string;
  photoURL: string | null;
  isLoggedIn: User | null;
};

export type LogTargetType = {
  fullName: string | null;
  title: string | null;
  composer: string | null;
  sheetId: string | null;
};

export type ReviewType = {
  fullName: string | null;
  title: string | null;
  composer: string | null;
  practicedSince: string;
  rating: number;
  content: string;
  // database related stats
  sheetId: string | null; // full name of the sheet music but slugged
  uid: string; // UID provided when the user logs in
  displayName: string;
  photoURL: string | null | undefined;
  creationDate?: string;
};
