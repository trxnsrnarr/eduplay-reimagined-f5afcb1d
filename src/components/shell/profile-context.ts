import { createContext, useContext } from "react";
import type { Profile } from "@/components/dashboard/types";

export const ProfileContext = createContext<Profile | null>(null);
export const useProfile = () => useContext(ProfileContext);
