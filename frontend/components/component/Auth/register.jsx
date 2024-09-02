"use client";

import { Icons } from "@/components/component/icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '@/graphql/mutations';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation'; // Import useRouter

export function UserAuthForm({ className, ...props }) {
    const [registerUser, { loading, error }] = useMutation(REGISTER_USER);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { t } = useTranslation('common'); // Access translations
    const router = useRouter(); // Use useRouter for navigation

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            errors.email = t('invalid_email'); // Use translation for invalid email
        }
        if (formData.password.length < 8) {
            errors.password = t('password_length'); // Use translation for password length
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
            const { data } = await registerUser({ variables: formData });
            alert(t('registration_successful')); 
                   router.push('/Auth/login')  
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
                setFormErrors({ global: t('registration_failed') }); // Use translation for registration failed
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`grid gap-6 ${className}`} {...props}>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="name">
                            {t('namePlaceholder')}
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t('namePlaceholder')}
                            type="text"
                            autoCapitalize="none"
                            autoComplete="name"
                            autoCorrect="off"
                            required
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            {t('emailPlaceholder')}
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('emailPlaceholder')}
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
                            {t('passwordPlaceholder')}
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={t('passwordPlaceholder')}
                            autoCapitalize="none"
                            autoCorrect="off"
                        />
                        {formErrors.password && (
                            <p className="text-red-500 text-sm">{formErrors.password}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isLoading ? t('registering') : t('register')}
                    </Button>
                    {formErrors.global && (
                        <p className="text-red-500 text-sm">{formErrors.global}</p>
                    )}
                </div>
            </form>
        </div>
    );
}
