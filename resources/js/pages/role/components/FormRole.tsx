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
import type { Role } from '@/types';

interface FormRoleProps {
    role?: Role;
}

const FormRole = ({ role }: FormRoleProps) => {
    const isEdit = !!role;
    const [open, setOpen] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            role_name: role?.role_name || '',
            description: role?.description || '',
        });

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);

        // Jika dialog ditutup, hapus semua error dan reset field ke awal
        if (!isOpen) {
            clearErrors();
            reset();
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            // Mode Edit → PUT /roles/{id}
            put(`/roles/${role.id}`, {
                onSuccess: () => {
                    reset();
                    setOpen(false); // tutup dialog setelah berhasil
                },
            });
        } else {
            // Mode Add → POST /roles
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
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Form Role</DialogTitle>
                        <DialogDescription>
                            Add role for your company here. Click save when
                            you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1" required>
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
                        <Field>
                            <Label htmlFor="username-1">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Deskripsi role..."
                            />
                            <InputError message={errors.description} />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
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
