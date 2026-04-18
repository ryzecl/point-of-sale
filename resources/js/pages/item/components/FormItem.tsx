// resources/js/pages/item/components/FormItem.tsx

import { useForm, router } from '@inertiajs/react'; // Tambahkan router
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
import { FileUpload } from '@/components/ui/file-upload'; // Import FileUpload
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { Item, Category } from '@/types';

interface FormItemProps {
    item?: Item;
    categories: Category[];
}

const FormItem = ({ item, categories }: FormItemProps) => {
    const isEdit = !!item;
    const [open, setOpen] = useState(false);

    // Initial Data Form - Kita definisikan tipe datanya agar tidak merah
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: item?.name || '',
            description: item?.description || '',
            price: item?.price,
            stock: item?.stock,
            min_stock: item?.min_stock,
            category_id: item?.category_id?.toString(),
            is_active: item ? !!item.is_active : true,
            img: null as File | string | null, // Pakai "as" agar bisa menerima File atau String (path lama)
        });

    // Sinkronisasi data saat item berubah atau modal dibuka
    useEffect(() => {
        if (open && item) {
            setData({
                name: item.name || '',
                description: item.description || '',
                price: item.price,
                stock: item.stock,
                min_stock: item.min_stock,
                category_id: item.category_id?.toString(),
                is_active: item.is_active,
                img: null,
            });
        }
    }, [open, item, setData]);

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
            // KHUSUS EDIT DENGAN FILE:
            // Gunakan router.post + _method: 'put' agar file ter-upload dengan benar
            router.post(
                `/items/${item.id}`,
                {
                    ...data,
                    _method: 'put',
                },
                {
                    onSuccess: () => {
                        setOpen(false);
                        reset();
                    },
                },
            );
        } else {
            post('/items', {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant={isEdit ? 'ghost' : 'default'}
                    size={isEdit ? 'icon' : 'default'}
                    className={
                        isEdit
                            ? 'h-8 w-8 transition-colors hover:text-primary'
                            : ''
                    }
                >
                    {isEdit ? (
                        <EditIcon className="h-4 w-4" />
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Edit Item' : 'Add New Item'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? 'Update item information below.'
                                : 'Create a new item by filling in the details below.'}
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="space-y-1">
                        <Field>
                            <Label htmlFor="name" required>
                                Item Name
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Enter item name..."
                                required
                            />
                            <InputError message={errors.name} />
                        </Field>

                        <Field>
                            <Label htmlFor="category_id" required>
                                Category
                            </Label>
                            <Select
                                value={data.category_id}
                                onValueChange={(value) =>
                                    setData('category_id', value)
                                }
                                required
                            >
                                <SelectTrigger id="category_id">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={cat.id.toString()}
                                        >
                                            {cat.cat_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} />
                        </Field>

                        <Field>
                            <Label htmlFor="price" required>
                                Price
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                value={data.price}
                                onChange={(e) =>
                                    setData('price', Number(e.target.value))
                                }
                                placeholder="Ex. 100000"
                                required
                            />
                            <InputError message={errors.price} />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="stock" required>
                                    Current Stock
                                </Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData('stock', Number(e.target.value))
                                    }
                                    placeholder="Ex. 100"
                                    required
                                />
                                <InputError message={errors.stock} />
                            </Field>

                            <Field>
                                <Label htmlFor="min_stock" required>
                                    Min. Stock Alert
                                </Label>
                                <Input
                                    id="min_stock"
                                    type="number"
                                    value={data.min_stock}
                                    onChange={(e) =>
                                        setData(
                                            'min_stock',
                                            Number(e.target.value),
                                        )
                                    }
                                    placeholder="Ex. 5"
                                    required
                                />
                                <InputError message={errors.min_stock} />
                            </Field>
                        </div>

                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Short description..."
                            />
                            <InputError message={errors.description} />
                        </Field>

                        <Field className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                                <Label htmlFor="status" className="text-base">
                                    Status
                                </Label>
                                <div className="text-sm text-muted-foreground">
                                    Visible in system?
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span
                                    className={
                                        data.is_active
                                            ? 'font-medium text-green-600'
                                            : 'text-muted-foreground'
                                    }
                                >
                                    {data.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <Switch
                                    id="status"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked)
                                    }
                                />
                            </div>
                        </Field>

                        {/* Input Gambar (Filament Style) */}
                        <Field>
                            <Label htmlFor="img" required={!isEdit}>
                                Product Image
                            </Label>
                            <FileUpload
                                id="img"
                                value={data.img}
                                onChange={(file) => setData('img', file)}
                                onRemove={() => setData('img', null)}
                            />
                            <InputError message={errors.img} />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
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

export default FormItem;
