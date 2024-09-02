import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // Use the correct import for the Next.js version you use
import { useEffect } from 'react';
import Loading from '../loading'; // Adjust the path as necessary

const AuthenticatedRoute = (WrappedComponent, redirectPath = '/dashboard') => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const { authenticated, loading } = useAuth(); // Use parentheses to call the hook

    useEffect(() => {
      if (!loading && authenticated) {
        router.replace(redirectPath); // Redirect authenticated users
      }
    }, [authenticated, loading, router, redirectPath]);

    if (loading) {
      return <Loading />; // Show a loading indicator while loading
    }

    if (authenticated) {
      return null; // Or a placeholder while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `AuthenticatedRoute(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthenticatedComponent;
};

export default AuthenticatedRoute;
