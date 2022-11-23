import React, { createContext, useContext, useState } from "react";
import { token } from "..";
import useLocalStorage from "../hooks/useLocalStorage";
import trpc from "../lib/trpc";

interface UserValues {
  isAuth: boolean | undefined;
  user: Record<string, any> | null;
}

const UserContext = createContext<UserValues>({ user: null, isAuth: true });

const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [a, setA] = useLocalStorage("token", token);
  console.log("token a: ", a);
  const { data } = trpc.user.getInfos.useQuery(a, {
    enabled: !!a,
    staleTime: Infinity,
  });

  return (
    <UserContext.Provider
      value={{
        isAuth: data?.isAuth,
        user: data?.user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
export const useUser = () => useContext(UserContext);
