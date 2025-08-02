import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useSelector } from "react-redux";
import type { RootState } from "../../App/store";
import { categoryApi } from "../../Features/Apis/categoryApi";

const MySwal = withReactContent(Swal);

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  createdAt?: string;
}

const ManageCategories = () => {
  const {
    data: rawCategories = [],
    isLoading,
    error,
    refetch,
  } = categoryApi.useGetAllCategoriesQuery(undefined, {
    pollingInterval: 60_000,
    refetchOnMountOrArgChange: true,
  });

  const allCategories: Category[] = rawCategories.map((cat: any) => ({
    id: cat.categoryId || cat.id,
    name: cat.name,
    imageUrl: cat.imageUrl,
    createdAt: cat.createdAt,
  }));

  const [createCategory] = categoryApi.useCreateCategoryMutation();
  const [updateCategory] = categoryApi.useUpdateCategoryMutation();
  const [deleteCategory] = categoryApi.useDeleteCategoryMutation();

  const firstName = useSelector((state: RootState) => state.auth.user?.firstName);
  const [searchTerm, setSearchTerm] = useState("");

  const cloud_name = "dwibg4vvf";
  const preset_key = "categories_images";

  const filteredCategories = allCategories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCategoryModal = async (initial?: Category) => {
    let selectedFile: File | null = null;

    const { value } = await MySwal.fire({
      title: initial ? "Edit Category" : "Add New Category",
      html: `
        <input id="category-name" class="swal2-input" placeholder="Category Name" value="${initial?.name ?? ""}" />
        <input type="file" id="category-image" class="swal2-file" accept="image/*" />
        <small style="display: block; margin-top: 8px; font-size: 0.8rem;">
          ${initial?.imageUrl ? `Current Image: <a href="${initial.imageUrl}" target="_blank">View</a>` : "No image uploaded"}
        </small>
      `,
      didOpen: () => {
        const input = document.getElementById("category-image") as HTMLInputElement;
        input?.addEventListener("change", (e: any) => {
          selectedFile = e.target.files[0];
        });
      },
      showCancelButton: true,
      confirmButtonText: initial ? "Update" : "Create",
      width: "500px",
      customClass: { popup: "glass-modal" },
      preConfirm: async () => {
        const nameInput = document.getElementById("category-name") as HTMLInputElement;
        const name = nameInput?.value?.trim();

        if (!name) {
          Swal.showValidationMessage("Category name is required.");
          return;
        }

        let imageUrl = initial?.imageUrl || "";

        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("upload_preset", preset_key);

          try {
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
              formData
            );
            imageUrl = response.data.secure_url;
          } catch (err) {
            Swal.showValidationMessage("Image upload failed.");
            return;
          }
        }

        return {
          name,
          categoryId: initial?.id,
          imageUrl,
        };
      },
    });

    if (!value) return;

    try {
      if (value.categoryId) {
        await updateCategory(value).unwrap();
        MySwal.fire("Updated!", "Category updated successfully.", "success");
      } else {
        await createCategory({ name: value.name, imageUrl: value.imageUrl }).unwrap();
        MySwal.fire("Created!", "Category created successfully.", "success");
      }
      refetch();
    } catch (err: any) {
      MySwal.fire("Error", err?.data?.message || "Failed to save category.", "error");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      MySwal.fire("Error!", "Invalid category ID.", "error");
      return;
    }

    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "glass-modal" },
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteCategory(id).unwrap();
      MySwal.fire("Deleted!", "Category has been removed.", "success");
      refetch();
    } catch (err: any) {
      MySwal.fire("Error!", err?.data?.message || "Failed to delete category.", "error");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-base-100 text-base-content">
      <div className="mb-6 text-xl sm:text-2xl font-semibold text-primary">
        👋 Hey {firstName || "there"}, manage your categories here.
      </div>

      <div className="w-full max-w-5xl mx-auto bg-base-200 rounded-xl border border-base-300 shadow-lg p-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-primary">Manage Categories</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by category name"
              className="input input-bordered w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => openCategoryModal()} className="btn btn-success">
              ➕ Add Category
            </button>
          </div>
        </div>

        {error ? (
          <div className="text-error text-center text-lg font-semibold">
            Something went wrong. Please try again.
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <PuffLoader color="#22d3ee" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center text-info text-lg">No categories found.</div>
        ) : (
          <table className="table table-zebra text-sm">
            <thead>
              <tr className="text-primary-content bg-primary text-xs uppercase">
                <th>Image</th>
                <th>Name</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td>{cat.name}</td>
                  <td>
                    {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="space-x-2">
                    <button onClick={() => openCategoryModal(cat)} className="btn btn-xs btn-info">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="btn btn-xs btn-error">
                      <FaDeleteLeft />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
