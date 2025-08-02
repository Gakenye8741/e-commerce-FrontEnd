import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  useCreateImageMutation,
  useDeleteImageMutation,
  useGetAllImagesQuery,
} from '../../Features/Apis/MediaApi';
import { useGetAllProductsQuery } from '../../Features/Apis/ProductApi';

interface Image {
  imageId: number;
  productId: number;
  url: string;
  alt?: string;
  createdAt: string;
}

interface Product {
  productId: number;
  title: string;
}

const ManageImages: React.FC = () => {
  const {
    data: imageResponse,
    isLoading,
    isError,
  } = useGetAllImagesQuery({});

  const images: Image[] = Array.isArray(imageResponse)
    ? imageResponse
    : imageResponse?.allImages || imageResponse?.data || [];

  const { data: productResponse = {} } = useGetAllProductsQuery({});
  const products: Product[] = Array.isArray(productResponse)
    ? productResponse
    : productResponse?.data || productResponse?.allProducts || [];

  const [createImage] = useCreateImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const [productId, setProductId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cloud_name = 'dwibg4vvf';
  const preset_key = 'categories_images';

  const handleCreateImage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !productId) {
      Swal.fire('Missing Info', 'Please select a product and image file.', 'warning');
      return;
    }

    const cloudFormData = new FormData();
    cloudFormData.append('file', file);
    cloudFormData.append('upload_preset', preset_key);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        cloudFormData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percent);
          },
        }
      );

      const url = response.data.secure_url;

      await createImage({
        productId: Number(productId),
        url,
        alt,
      }).unwrap();

      setProductId('');
      setFile(null);
      setAlt('');
      setUploadProgress(0);
      setIsModalOpen(false);

      Swal.fire('Success', 'Image uploaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to upload image.', 'error');
    }
  };

  const handleDelete = async (imageId: number) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This image will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteImage(imageId).unwrap();
        Swal.fire('Deleted!', 'Image has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete image.', 'error');
      }
    }
  };

  const getProductTitle = (id: number) =>
    products.find((p: Product) => p.productId === id)?.title || `Product ${id}`;

  return (
    <div className="min-h-screen p-6 bg-base-100 text-base-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary">🖼️ Manage Product Images</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-success flex items-center gap-2"
        >
          <Plus size={18} />
          Add Image
        </button>
      </div>

      {isLoading ? (
        <p className="text-info">Loading images...</p>
      ) : isError ? (
        <p className="text-error">❌ Failed to load images.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img: Image) => (
            <div key={img.imageId} className="bg-base-200 rounded-xl shadow p-4">
              <img
                src={img.url}
                alt={img.alt || 'Product Image'}
                className="w-full h-48 object-cover rounded"
              />

              <div className="mt-3 text-sm space-y-1">
                <p>
                  <span className="font-semibold">🛍️ Product:</span>{' '}
                  {getProductTitle(img.productId)}
                </p>
                {img.alt && (
                  <p>
                    <span className="font-semibold">📝 Alt Text:</span> {img.alt}
                  </p>
                )}
                <p className="text-xs text-base-content/60">
                  ⏰ Uploaded: {new Date(img.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button className="btn btn-warning btn-sm" disabled>
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(img.imageId)}
                  className="btn btn-error btn-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-base-200 border border-base-300 rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-error hover:scale-110 transition"
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold mb-4 text-primary">Upload New Image</h3>

            <form onSubmit={handleCreateImage} className="space-y-4">
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select Product</option>
                {products.map((product: Product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.title}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Alt text (optional)"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="input input-bordered w-full"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered w-full"
                required
              />

              {uploadProgress > 0 && (
                <progress
                  className="progress progress-info w-full"
                  value={uploadProgress}
                  max={100}
                />
              )}

              <button type="submit" className="btn btn-primary w-full">
                Upload Image
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageImages;
