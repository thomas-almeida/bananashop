import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/store/useUserStore';

export function useSessionUser() {
  const { data: session, status } = useSession();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (status === 'authenticated' && session?.user?.id && !user) {
        try {
          const response = await fetch(`/api/user/${session.user.id}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      } else if (status === 'unauthenticated' && user) {
        // Clear user from store on sign out
        setUser(null);
      }
    };

    fetchUser();
  }, [session, status, user, setUser]);

  return {
    user,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}
