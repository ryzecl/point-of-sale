import { useForm } from '@inertiajs/react';
import { EditIcon, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { Role } from '@/types';

interface FormRoleProps {
    role?: Role;
    all_permissions: string[];
}

const FormRole = ({ role, all_permissions }: FormRoleProps) => {
    const isEdit = !!role;
    const [open, setOpen] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            role_name: role?.role_name || '',
            permissions: role?.permissions || [] as string[],
        });

    useEffect(() => {
        if (open && role) {
            setData({
                role_name: role.role_name || '',
                permissions: role.permissions || [],
            });
        }
    }, [open, role, setData]);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);

        if (!isOpen) {
            clearErrors();
            reset();
        }
    };

    const handlePermissionChange = (permission: string, checked: boolean) => {
        const newPermissions = checked
            ? [...data.permissions, permission]
            : data.permissions.filter((p) => p !== permission);
        setData('permissions', newPermissions);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            put(`/roles/${role.id}`, {
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        } else {
            post('/roles', {
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
                    className={isEdit ? 'h-8 w-8 hover:text-primary' : ''}
                >
                    {isEdit ? (
                        <EditIcon className="h-4 w-4" />
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" /> Add Role
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Form Role</DialogTitle>
                        <DialogDescription>
                            Manage roles and their permissions here.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="mt-4">
                        <Field>
                            <Label htmlFor="role_name" required>
                                Role Name
                            </Label>
                            <Input
                                id="role_name"
                                value={data.role_name}
                                onChange={(e) =>
                                    setData('role_name', e.target.value)
                                }
                                placeholder="Admin, Kasir, dll"
                                required
                            />
                            <InputError message={errors.role_name} />
                        </Field>

                        <div className="space-y-4">
                            <Label>Permissions</Label>
                            <div className="grid grid-cols-2 gap-4 rounded-md border p-4 max-h-[300px] overflow-y-auto">
                                {all_permissions.map((permission) => (
                                    <div key={permission} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`perm-${permission}`}
                                            checked={data.permissions.includes(permission)}
                                            onCheckedChange={(checked) => handlePermissionChange(permission, checked as boolean)}
                                        />
                                        <Label
                                            htmlFor={`perm-${permission}`}
                                            className="text-sm font-normal cursor-pointer capitalize"
                                        >
                                            {permission.replace(/_/g, ' ')}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.permissions} />
                        </div>
                    </FieldGroup>
                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={processing} type="submit">
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormRole;
