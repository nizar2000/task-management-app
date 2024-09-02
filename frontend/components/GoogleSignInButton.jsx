import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@apollo/client';
import { GOOGLE_LOGIN_MUTATION } from '@/graphql/mutations';
import { useAuth } from '@/context/AuthContext';

const GoogleLoginButton = () => {
    const [registerGoogle] = useMutation(GOOGLE_LOGIN_MUTATION);
    const { login } = useAuth();

    const handleSuccess = async (response) => {
        try {
            const { data } = await registerGoogle({ variables: { token: response.credential } });
            login(data.registerGoogle.access_token, data.registerGoogle.user);
        } catch (err) {
            console.error('Google registration failed', err);
        }
    };

    const handleError = (error) => {
        console.error('Google login error', error);
    };

    return (
        <GoogleOAuthProvider clientId="52875933283-0u153opf9eb4hcl0rdmbv82lua3q1u3d.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={handleSuccess}
                onFailure={handleError}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
