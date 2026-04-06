import { useForm } from '@inertiajs/react';
import { EditIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { User, Role } from '@/types';

interface FormUserProps {
    user?: User;
    roles: Role[];
}

const FormUser = ({ user, roles }: FormUserProps) => {
    const isEdit = !!user;
    const [open, setOpen] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: user?.name || '',
            email: user?.email || '',
            password: '',
            role_id: user?.role_id?.toString() || '',
        });

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);

        if (!isOpen) {
            clearErrors();
            reset();
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            put(`/users/${user.id}`, {
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        } else {
            post('/users', {
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setOpen(true)}
                    variant={isEdit ? 'ghost' : 'default'}
                    size={isEdit ? 'icon' : 'default'}
                    className={isEdit ? 'h-8 w-8 hover:text-primary transition-colors' : ''}
                >
                    {isEdit ? (
                        <EditIcon className="h-4 w-4" />
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" /> Add User
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? 'Update user information below. Leave password empty to keep current password.'
                                : 'Create a new user account by filling in the details below.'}
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="space-y-4">
                        <Field>
                            <Label htmlFor="name" required>Full Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                            <InputError message={errors.name} />
                        </Field>
                        <Field>
                            <Label htmlFor="email" required>Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="john@example.com"
                                required
                            />
                            <InputError message={errors.email} />
                        </Field>
                        <Field>
                            <Label htmlFor="password" required={!isEdit}>
                                Password {isEdit && <span className="text-muted-foreground font-normal">(Optional)</span>}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required={!isEdit}
                            />
                            <InputError message={errors.password} />
                        </Field>
                        <Field>
                            <Label htmlFor="role_id" required>Role</Label>
                            <Select
                                value={data.role_id}
                                onValueChange={(value) => setData('role_id', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id.toString()}>
                                            {role.role_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role_id} />
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button disabled={processing} type="submit">
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormUser;
