import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { createClient } from "@/shared/lib/supabase/client";

export const useUser = () => {
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const getUserData = async () => {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();

      if (!data?.user) return;

      const userData = {
        id: data?.user?.id,
        email: data?.user?.email,
        role: data?.user?.role,
        createdAt: new Date(data?.user?.created_at),
      } satisfies User;

      setUser(userData);
    };

    getUserData();
  }, [user]);

  return { user, setUser };
};
