import { useForm } from '@inertiajs/react';
import { EditIcon, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
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
import type { Category } from '@/types';

interface FormCategoryProps {
    category?: Category;
}

const FormCategory = ({ category }: FormCategoryProps) => {
    const isEdit = !!category;
    const [open, setOpen] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            cat_name: category?.cat_name || '',
            description: category?.description || '',
        });

    useEffect(() => {
        if (open && category) {
            setData({
                cat_name: category.cat_name || '',
                description: category.description || '',
            });
        }
    }, [open, category, setData]);

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
            // Mode Edit → PUT /categories/{id}
            put(`/categories/${category.id}`, {
                onSuccess: () => {
                    reset();
                    setOpen(false); // tutup dialog setelah berhasil
                },
            });
        } else {
            // Mode Add → POST /categories
            post('/categories', {
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
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Form Category</DialogTitle>
                        <DialogDescription>
                            Add category for your company here. Click save when
                            you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1" required>
                                Category Name
                            </Label>
                            <Input
                                id="cat_name"
                                value={data.cat_name}
                                onChange={(e) =>
                                    setData('cat_name', e.target.value)
                                }
                                placeholder="Snack, Drink, Dessert"
                                required
                            />
                            <InputError message={errors.cat_name} />
                        </Field>
                        <Field>
                            <Label htmlFor="username-1">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Deskripsi category..."
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

export default FormCategory;
