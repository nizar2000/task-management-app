"use client";

import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useSession, signIn } from "next-auth/react";
import { LOGIN_USER, REGISTER_SOCIAL_MUTATION } from '@/graphql/mutations';
import { Icons } from "@/components/component/icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/loading';

export function Auth({ className, ...props }) {
    
    const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [registerOAuth] = useMutation(REGISTER_SOCIAL_MUTATION);
    const { t } = useTranslation('common');

    useEffect(() => {
        if (status === 'authenticated' && session) {
            const registerUser = async () => {
                const { provider, accessToken } = session;
                try {
                    const { data } = await registerOAuth({
                        variables: { provider, token: accessToken },
                    });
                    const authToken = data.RegisterSocial.access_token;
                    localStorage.setItem('authToken', authToken);
                    login(authToken, data.RegisterSocial.user);
                    router.push('/dashboard');
                } catch (error) {
                    console.error(t('register_error'), error);
                }
            };
            registerUser();
        }
    }, [session, status, registerOAuth, login, router, t]);

    if (status === 'loading') {
        return <Loading />;
    }

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            errors.email = t('invalid_email');
        }
        if (formData.password.length < 8) {
            errors.password = t('password_length');
        }
        return errors;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await loginUser({ variables: formData });
            login(data.loginUser.token, data.loginUser.user);
        } catch (err) {
            if (err.graphQLErrors) {
                err.graphQLErrors.forEach(({ extensions }) => {
                    if (extensions.category === 'validation' && extensions.validation) {
                        const errorMessages = {};
                        Object.keys(extensions.validation).forEach((key) => {
                            errorMessages[key] = extensions.validation[key][0];
                        });
                        setFormErrors(errorMessages);
                    }
                });
            } else {
                console.error(err);
                setFormErrors({ global: t('login_failed') });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid gap-6" {...props}>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            {t('email')}
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('email_placeholder')}
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                        />
                        {formErrors.email && (
                            <p className="text-red-500 text-sm">{formErrors.email}</p>
                        )}
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="password">
                            {t('password')}
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoCapitalize="none"
                            autoCorrect="off"
                        />
                        {formErrors.password && (
                            <p className="text-red-500 text-sm">{formErrors.password}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={isLoading || loading}>
                        {isLoading || loading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : t('login')}
                    </Button>
                    {formErrors.global && (
                        <p className="text-red-500 text-sm">{formErrors.global}</p>
                    )}
                    {error && !formErrors.global && (
                        <p className="text-red-500 text-sm">{t('error_message')}</p>
                    )}
                </div>
            </form>
            <div className="mt-4 text-center">
                <Link href="/Auth/forgot-password">
                    <p className="text-sm text-blue-500 hover:underline">{t('forgot_password')}</p>
                </Link>
            </div>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        {t('or_continue_with')}
                    </span>
                </div>
            </div>
            <p>{t('sign_in_with')}</p>
            <div>
                <>
                    <Button onClick={() => signIn('google')}>{t('sign_in_google')}</Button>
                    <Button onClick={() => signIn('facebook')}>{t('sign_in_facebook')}</Button>
                </>
            </div>
        </div>
    );
}
