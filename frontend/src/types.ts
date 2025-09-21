import { Auth, User } from "firebase/auth";
import { ReactNode } from "react";

export type LayoutContextType = {
  setIsLogging: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggingDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggingFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingLogDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingLogFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAnyLogWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLogging: boolean;
  isLoggingFinished: boolean;
  isEditingLogFinished: boolean;
  isAnyLogWindowOpen: boolean;
  logTarget: LogTargetType;
  setLogTarget: React.Dispatch<React.SetStateAction<LogTargetType>>;
  uid: string | undefined;
  displayName: string;
  photoURL: string | null;
  isLoggedIn: User | null;
  auth: Auth;
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
  creationDate?: string;
  likes: number;
};

export type UserType = {
  aboutMe: string;
  currentlyPracticing: LogTargetType[];
  displayName: string;
  email: string;
  favouritePiece: LogTargetType | null;
  photoURL: string | null;
  sheetsTotal: number;
  uid: number;
};

export type SheetType = {
  composer: string;
  creationDate: string;
  fullName: string;
  practicedCount: number;
  reviewCount: number;
  title: string;
};

export type SearchResultType = {
  ns: number;
  title: string;
  snippet: string;
  timestamp: string;
  size: number;
  wordcount: number;
};



