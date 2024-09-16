'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Card, Button } from 'flowbite-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import { SaveApiCredentials } from '@/action/form';
import { getCookie, setCookie } from 'cookies-next';

const providersIcons = {
    Salesforce: '/salesforce-icon.svg',
};

const credentialsSchema = z.object({
    clientId: z.string().min(1, "Client ID is required"),
    clientSecret: z.string().min(1, "Client Secret is required"),
});

type CredentialsSchemaType = z.infer<typeof credentialsSchema>;


// MAIN METHOD: return the signin page 
export default function SignIn() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    
    const isFirstRender = useRef(true);

    if (isFirstRender.current) {
        isFirstRender.current = false;
        console.log('@@@@@@@@@@@@@@@@@');
        console.log(session);
        console.log(status);
    }

    const [credentials, setCredentials] = useState<CredentialsSchemaType | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const form = useForm<CredentialsSchemaType>({
        resolver: zodResolver(credentialsSchema),
    });

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            console.log('############################ 1');
            if (status === 'authenticated' && session) {
                setShouldRedirect(true);
            } else {
                console.log('#else');
            }
        }
    }, [session, status]);

    useEffect(() => {
        if (shouldRedirect) {
            router.push('/');
        }
    }, [shouldRedirect, router]);

    const isInitialMount2 = useRef(true);

    useEffect(() => {
        if (isInitialMount2.current) {
            isInitialMount2.current = false;
            console.log('############################ 2');
            // Check for existing cookies
            const clientId = getCookie('salesforce_client_id');
            const clientSecret = getCookie('salesforce_client_secret');
            
            if (clientId && clientSecret) {
                form.setValue('clientId', clientId);
                form.setValue('clientSecret', clientSecret);
            } else {
                console.log('@ empt cookie '+clientId);
            }
        }
    }, []);

    async function onSubmit(values: CredentialsSchemaType) {
        console.log('############################  submit');
        try {
            // Save API credentials to Prisma database (existing functionality)
            await SaveApiCredentials(values);
            setCredentials(values);
            
            // Store credentials in cookies (new functionality)
            setCookie('salesforce_client_id', values.clientId, { maxAge: 3600, path: '/' });
            setCookie('salesforce_client_secret', values.clientSecret, { maxAge: 3600, path: '/' });

            toast({
                title: "Success",
                description: "Salesforce credentials stored successfully.",
            });

            setIsLoggingIn(true);
            // Initiate Salesforce sign-in
            const result = await signIn('salesforce', { 
                clientId: values.clientId,
                clientSecret: values.clientSecret,
                redirect: false // Prevent automatic redirect
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // If sign-in was successful, redirect to the dashboard
            if (result?.ok) {
                router.push('/'); // or your dashboard route
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
            toast({
                title: "Error",
                description: "Failed to sign in with Salesforce.",
                variant: "destructive",
            });
        }
    }

    async function handleLogin() {
        // Fetch existing cookies
        const clientId = getCookie('salesforce_client_id');
        const clientSecret = getCookie('salesforce_client_secret');

        if (clientId && clientSecret) {
            // If cookies exist, use them to sign in
            const result = await signIn('salesforce', { 
                clientId,
                clientSecret,
                redirect: false // Prevent automatic redirect
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // If sign-in was successful, redirect to the dashboard
            if (result?.ok) {
                router.push('/'); // or your dashboard route
            }
        } else {
            // Handle case where credentials are not available
            toast({
                title: "Error",
                description: "No credentials found. Please enter your Client ID and Client Secret.",
                variant: "destructive",
            });
        }
    }

    if (status === 'loading') {
        return null;
    }

    if (session) {
        router.push('/');
        return null;
    }

    return (
        <div className="flex h-screen">
            <div className="m-auto">
                <div className="max-w-md">
                    <Card>
                        <h5 className="mb-3 text-base text-gray-900 dark:text-white lg:text-xl">
                            Connect to Salesforce
                        </h5>
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            For this demo, we use Salesforce as the provider. Click the salesforce button to get authenticated.
                        </p>
                        {/* Commenting out the form for direct login functionality */}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                            <div>
                                <label htmlFor="clientId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Client ID</label>
                                <input
                                    {...form.register("clientId")}
                                    type="text"
                                    id="clientId"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                {form.formState.errors.clientId && (
                                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.clientId.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="clientSecret" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Client Secret</label>
                                <input
                                    {...form.register("clientSecret")}
                                    type="password"
                                    id="clientSecret"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                {form.formState.errors.clientSecret && (
                                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.clientSecret.message}</p>
                                )}
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full bg-blue-500 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>
                        {/* <div>
                            <p>You can directly login using this button</p>
                        <Button 
                            onClick={handleLogin} // Call the new login handler
                            className="w-full bg-blue-500 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                        >
                            Login
                        </Button>
                        </div> */}
                        
                    </Card>
                </div>
            </div>
        </div>
    );
}