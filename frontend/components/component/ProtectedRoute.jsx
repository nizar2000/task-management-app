import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loading from '../loading';

const ProtectedRoute = (WrappedComponent) => {
  // Create a functional component
  const ProtectedComponent = (props) => {
    const router = useRouter();
    const { authenticated, loading } = useAuth(); // Call the hooks here

    useEffect(() => {
      if (!loading && !authenticated) {
        router.push('/Auth/login'); // Redirect unauthenticated users
      }
    }, [authenticated, loading, router]);

    if (loading || !authenticated) {
      return <Loading />; // Show loading indicator while authentication is being checked
    }

    return <WrappedComponent {...props} />;
  };

  // Set a display name for the component
  ProtectedComponent.displayName = `ProtectedRoute(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ProtectedComponent;
};

export default ProtectedRoute;
