import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Mail,
    Shield,
    Calendar,
    UserIcon,
    Clock,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import type { User } from '@/types';

interface ShowProps {
    user: { data: User };
}

export default function Show({ user }: ShowProps) {
    const userData = user.data;

    // Fallbacks if undefined
    const name = userData.name || 'Unknown User';
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    // Format dates if available, fallback to '-'
    const createdAt = userData.created_at
        ? new Date(userData.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : '-';

    const updatedAt = userData.updated_at
        ? new Date(userData.updated_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '-';

    return (
        <>
            <Head title={`User Profile - ${name}`} />
            <div className="container mx-auto max-w-5xl space-y-6 p-5 pt-6 pb-12">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center space-x-4">
                        <Link href="/users">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back</span>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                User Profile
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Detailed information for {name}.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid items-start gap-6 md:grid-cols-3">
                    {/* Profile Summary Card */}
                    <Card className="relative h-full overflow-hidden border-none bg-gradient-to-b from-primary/10 via-background to-background shadow-md md:col-span-1">
                        <div className="absolute top-0 left-0 h-24 w-full bg-primary/20"></div>
                        <CardContent className="relative z-10 flex flex-col items-center p-6 pt-12 text-center">
                            <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-primary text-4xl font-bold text-primary-foreground shadow-xl ring-4 ring-background">
                                {initials}
                            </div>
                            <h2 className="mt-2 text-xl font-bold capitalize">
                                {name}
                            </h2>
                            <div className="mt-2 mb-5">
                                <Badge
                                    variant="secondary"
                                    className="px-3 py-1 text-xs font-semibold tracking-wider uppercase"
                                >
                                    {userData.role?.role_name || 'No Role'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 px-4 py-2 text-sm break-all text-foreground">
                                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                                {userData.email}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Information Card */}
                    <Card className="h-full border shadow-sm md:col-span-2">
                        <CardHeader className="border-b bg-muted/20 pb-5">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <UserIcon className="h-5 w-5 text-primary" />
                                Account Details
                            </CardTitle>
                            <CardDescription>
                                Comprehensive system record for this user
                                account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <dl className="divide-y divide-border">
                                <div className="flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:flex-row sm:items-center sm:justify-between">
                                    <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <UserIcon className="h-4 w-4 text-muted-foreground/70" />{' '}
                                        Full Name
                                    </dt>
                                    <dd className="text-sm font-medium text-foreground capitalize">
                                        {name}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:flex-row sm:items-center sm:justify-between">
                                    <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Mail className="h-4 w-4 text-muted-foreground/70" />{' '}
                                        Email Address
                                    </dt>
                                    <dd className="text-sm font-medium text-foreground">
                                        {userData.email}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:flex-row sm:items-center sm:justify-between">
                                    <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Shield className="h-4 w-4 text-muted-foreground/70" />{' '}
                                        Assigned Role
                                    </dt>
                                    <dd className="rounded bg-primary/10 px-2 py-0.5 text-sm font-medium text-foreground text-primary uppercase">
                                        {userData.role?.role_name || 'N/A'}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:flex-row sm:items-center sm:justify-between">
                                    <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Calendar className="h-4 w-4 text-muted-foreground/70" />{' '}
                                        Account Created
                                    </dt>
                                    <dd className="text-sm font-medium text-foreground">
                                        {createdAt}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:flex-row sm:items-center sm:justify-between">
                                    <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Clock className="h-4 w-4 text-muted-foreground/70" />{' '}
                                        Last Updated
                                    </dt>
                                    <dd className="text-sm font-medium text-muted-foreground">
                                        {updatedAt}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'User Management', href: '/users' },
        { title: 'Profile Detail', href: '#' },
    ],
};
