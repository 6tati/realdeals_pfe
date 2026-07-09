import { useState, useEffect } from 'react';
import { getProducts } from '../../services/api';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';

const inputClass = 'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-black';

const emptyForm = {
    name: '',
    description: '',
    prix: '',
    stock: '',
    tailles: '',
    imageUrl: '',
    imageUrls: '',
    idCateg: '',
};

export default function AdminProducts() {
    const [produits, setProduits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState(emptyForm);

    const fetchAll = () => {
        setLoading(true);
        setError(null);

        Promise.all([
            getProducts(),
            fetch('http://localhost:8080/api/categories').then(res => res.json()),
        ])
            .then(([prods, cats]) => {
                setProduits(prods);
                setCategories(cats);
            })
            .catch(() => setError('Failed to load products.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setImageFiles([]);
        setEditingId(null);
        setShowForm(false);
        setError(null);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        setImageFiles(files);
    };

    const getProductImages = (product) => {
        const urls = [
            product.imageUrl,
            ...(product.imageUrls
                ? product.imageUrls.split(',').map(url => url.trim())
                : []),
        ]
            .filter(Boolean)
            .filter((url, index, arr) => arr.indexOf(url) === index);

        return urls;
    };

    const uploadImages = async () => {
        if (imageFiles.length === 0) {
            const existingImages = form.imageUrls
                ? form.imageUrls.split(',').map(url => url.trim()).filter(Boolean)
                : [];

            if (existingImages.length > 0) return existingImages;
            return form.imageUrl ? [form.imageUrl] : [];
        }

        setUploading(true);
        const token = localStorage.getItem('token');
        const uploadedUrls = [];

        try {
            for (const file of imageFiles) {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('http://localhost:8080/api/upload/product-image', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error(`Image upload failed: ${file.name}`);
                }

                const data = await res.json();
                uploadedUrls.push(data.imageUrl);
            }

            return uploadedUrls;
        } finally {
            setUploading(false);
        }
    };

    const startCreate = () => {
        setForm(emptyForm);
        setImageFiles([]);
        setEditingId(null);
        setShowForm(true);
        setError(null);
    };

    const startEdit = (product) => {
        const images = getProductImages(product);

        setForm({
            name: product.name || '',
            description: product.description || '',
            prix: product.prix ?? '',
            stock: product.stock ?? '',
            tailles: product.tailles || '',
            imageUrl: product.imageUrl || images[0] || '',
            imageUrls: images.join(','),
            idCateg: product.categorie?.idCateg ? String(product.categorie.idCateg) : '',
        });

        setImageFiles([]);
        setEditingId(product.idProd);
        setShowForm(true);
        setError(null);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const uploadedImageUrls = await uploadImages();

            const payload = {
                name: form.name,
                description: form.description,
                prix: parseFloat(form.prix),
                stock: parseInt(form.stock, 10),
                tailles: form.tailles || null,
                imageUrl: uploadedImageUrls[0] || null,
                imageUrls: uploadedImageUrls.join(','),
                categorie: form.idCateg ? { idCateg: parseInt(form.idCateg, 10) } : null,
            };

            const token = localStorage.getItem('token');
            const isEditing = editingId !== null;

            const res = await fetch(
                isEditing
                    ? `http://localhost:8080/api/produits/${editingId}`
                    : 'http://localhost:8080/api/produits',
                {
                    method: isEditing ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (res.ok) {
                resetForm();
                fetchAll();
            } else {
                const text = await res.text();
                console.error(text);
                setError(isEditing ? 'Failed to update product.' : 'Failed to create product.');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Network error.');
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/produits/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                setProduits(prev => prev.filter(p => p.idProd !== id));
                if (editingId === id) resetForm();
            } else {
                setError('Failed to delete product.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error.');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            {error && <div className="mb-5"><Alert type="error">{error}</Alert></div>}

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-neutral-500">
                    {produits.length} product{produits.length !== 1 ? 's' : ''} in catalog.
                </p>

                <button
                    onClick={showForm ? resetForm : startCreate}
                    className="rounded-xl bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
                >
                    {showForm ? 'Cancel' : '+ Add Product'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
                    <div className="mb-5 flex flex-col gap-1">
                        <h3 className="text-lg font-black uppercase tracking-tight">
                            {editingId ? 'Edit Product' : 'Create Product'}
                        </h3>
                        <p className="text-sm text-neutral-500">
                            {editingId
                                ? 'Update product details. Upload new images only if you want to replace the current gallery.'
                                : 'Create a new product and upload one or more images.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <Field label="Product name">
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Oversized Tee"
                                required
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Category">
                            <select name="idCateg" value={form.idCateg} onChange={handleChange} className={inputClass}>
                                <option value="">No Category</option>
                                {categories.map(c => (
                                    <option key={c.idCateg} value={c.idCateg}>{c.name}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Price">
                            <input
                                type="number"
                                name="prix"
                                value={form.prix}
                                onChange={handleChange}
                                placeholder="299"
                                required
                                min="0"
                                step="0.01"
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Stock">
                            <input
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                placeholder="20"
                                required
                                min="0"
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Sizes">
                            <input
                                type="text"
                                name="tailles"
                                value={form.tailles}
                                onChange={handleChange}
                                placeholder="S,M,L,XL or ONE SIZE"
                                className={inputClass}
                            />
                        </Field>

                        <Field label={editingId ? 'Replace product images' : 'Product images'}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImagesChange}
                                className={inputClass}
                            />

                            {imageFiles.length > 0 ? (
                                <div className="mt-3 grid grid-cols-4 gap-3">
                                    {imageFiles.map((file, index) => (
                                        <div key={`${file.name}-${index}`} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="h-20 w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : form.imageUrls ? (
                                <div className="mt-3 grid grid-cols-4 gap-3">
                                    {form.imageUrls.split(',').map(url => url.trim()).filter(Boolean).map((url, index) => (
                                        <div key={`${url}-${index}`} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                                            <img
                                                src={url}
                                                alt={`Current image ${index + 1}`}
                                                className="h-20 w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </Field>

                        <Field label="Image URL fallback">
                            <input
                                type="text"
                                name="imageUrl"
                                value={form.imageUrl}
                                onChange={handleChange}
                                placeholder="Optional image URL"
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Description">
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Short product description"
                                rows={3}
                                className={`${inputClass} resize-none`}
                            />
                        </Field>
                    </div>

                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="mt-6 w-full rounded-xl bg-black py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                    >
                        {saving || uploading
                            ? editingId ? 'Updating...' : 'Creating...'
                            : editingId ? 'Update Product' : 'Create Product'}
                    </button>
                </form>
            )}

            <div className="overflow-hidden rounded-2xl border border-neutral-200">
                <div className="hidden lg:grid grid-cols-[2fr_1fr_0.8fr_0.7fr_0.6fr_0.8fr] gap-4 bg-neutral-50 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    <span>Product</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span>Sizes</span>
                    <span>Stock</span>
                    <span className="text-right">Action</span>
                </div>

                <div className="divide-y divide-neutral-100">
                    {produits.map(p => {
                        const images = getProductImages(p);
                        const previewImage = images[0] || p.imageUrl;

                        return (
                            <div key={p.idProd} className="grid grid-cols-1 gap-3 px-5 py-4 lg:grid-cols-[2fr_1fr_0.8fr_0.7fr_0.6fr_0.8fr] lg:items-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-neutral-100 flex-shrink-0">
                                        {previewImage && (
                                            <img src={previewImage} alt={p.name} className="h-full w-full object-cover" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-bold truncate">{p.name}</p>
                                        <p className="truncate text-xs text-neutral-500">
                                            {images.length > 1 ? `${images.length} images` : p.description || 'No description'}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm text-neutral-500">{p.categorie?.name || '—'}</p>
                                <p className="font-bold">{p.prix} MAD</p>
                                <p className="text-sm text-neutral-500">{p.tailles || '—'}</p>
                                <p>
                                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.stock === 0 ? 'bg-red-50 text-red-700' : 'bg-neutral-100 text-neutral-700'}`}>
                                        {p.stock}
                                    </span>
                                </p>
                                <div className="flex justify-start gap-3 lg:justify-end">
                                    <button
                                        onClick={() => startEdit(p)}
                                        className="text-xs font-black uppercase tracking-widest text-neutral-500 transition-colors hover:text-black"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.idProd)}
                                        className="text-xs font-black uppercase tracking-widest text-neutral-400 transition-colors hover:text-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-neutral-500">
                {label}
            </span>
            {children}
        </label>
    );
}
