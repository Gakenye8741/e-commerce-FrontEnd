import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useSelector } from "react-redux";
import type { RootState } from "../../App/store";
import { subcategoryApi } from "../../Features/Apis/SubCategoryApi";
import { categoryApi } from "../../Features/Apis/categoryApi";

const MySwal = withReactContent(Swal);

interface Subcategory {
  subcategoryId: string;
  name: string;
  categoryId: string;
  imageUrl?: string;
  createdAt?: string;
}

const ManageSubcategories = () => {
  const {
    data: rawSubcategories = [],
    isLoading,
    error,
    refetch,
  } = subcategoryApi.useGetAllSubcategoriesQuery();

  const { data: rawCategories = [] } = categoryApi.useGetAllCategoriesQuery();

  const allSubcategories: Subcategory[] = rawSubcategories.map((sub: any) => ({
    subcategoryId: sub.subcategoryId || sub.id,
    name: sub.name,
    categoryId: sub.categoryId,
    imageUrl: sub.imageUrl,
    createdAt: sub.createdAt,
  }));

  const allCategories = rawCategories.map((cat: any) => ({
    categoryId: cat.categoryId || cat.id,
    name: cat.name,
  }));

  const [createSubcategory] = subcategoryApi.useCreateSubcategoryMutation();
  const [updateSubcategory] = subcategoryApi.useUpdateSubcategoryMutation();
  const [deleteSubcategory] = subcategoryApi.useDeleteSubcategoryMutation();

  const firstName = useSelector((state: RootState) => state.auth.user?.firstName);
  const [searchTerm, setSearchTerm] = useState("");

  const cloud_name = "dwibg4vvf";
  const preset_key = "categories_images";

  const filteredSubcategories = allSubcategories.filter((sub) =>
    sub.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openSubcategoryModal = async (initial?: Subcategory) => {
    let selectedFile: File | null = null;

    const categoryOptions = allCategories
      .map(
        (cat: any) =>
          `<option value="${cat.categoryId}" ${
            cat.categoryId === initial?.categoryId ? "selected" : ""
          }>${cat.name}</option>`
      )
      .join("");

    const { value } = await MySwal.fire({
      title: initial ? "Edit Subcategory" : "Add Subcategory",
      html: `
        <input id="subcategory-name" class="swal2-input" placeholder="Subcategory Name" value="${initial?.name ?? ""}" />
        <select id="subcategory-categoryId" class="swal2-select" style="width: 100%; padding: 8px; border-radius: 4px; margin-top: 10px;">
          <option disabled value="">Select a Category</option>
          ${categoryOptions}
        </select>
        <input type="file" id="subcategory-image" class="swal2-file" accept="image/*" />
        <small style="display: block; margin-top: 8px; font-size: 0.8rem;">
          ${
            initial?.imageUrl && initial.imageUrl.trim() !== ""
              ? `Current Image: <a href="${initial.imageUrl}" target="_blank" rel="noreferrer">View</a>`
              : "No image uploaded"
          }
        </small>
      `,
      didOpen: () => {
        const input = document.getElementById("subcategory-image") as HTMLInputElement;
        input?.addEventListener("change", (e: any) => {
          selectedFile = e.target.files[0];
        });
      },
      showCancelButton: true,
      confirmButtonText: initial ? "Update" : "Create",
      width: "500px",
      customClass: { popup: "glass-modal" },
      preConfirm: async () => {
        const name = (document.getElementById("subcategory-name") as HTMLInputElement)?.value?.trim();
        const categoryId = (document.getElementById("subcategory-categoryId") as HTMLSelectElement)?.value;

        if (!name || !categoryId) {
          Swal.showValidationMessage("Subcategory name and category are required.");
          return;
        }

        let imageUrl = initial?.imageUrl || "";

        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("upload_preset", preset_key);

          try {
            MySwal.showLoading();
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
              formData
            );
            imageUrl = response.data.secure_url || "";
          } catch (err) {
            Swal.showValidationMessage("Image upload failed.");
            return;
          } finally {
            MySwal.hideLoading();
          }
        }

        return {
          name,
          categoryId,
          ...(imageUrl ? { imageUrl } : {}),
          subcategoryId: initial?.subcategoryId,
        };
      },
    });

    if (!value) return;

    try {
      if (value.subcategoryId) {
        await updateSubcategory(value).unwrap();
        MySwal.fire("Updated!", "Subcategory updated successfully.", "success");
      } else {
        await createSubcategory({
          name: value.name,
          categoryId: value.categoryId,
          imageUrl: value.imageUrl || undefined,
        }).unwrap();
        MySwal.fire("Created!", "Subcategory created successfully.", "success");
      }

      // Refetch after short delay to ensure backend processed changes
      setTimeout(() => {
        refetch();
      }, 500);
    } catch (err: any) {
      MySwal.fire("Error", err?.data?.message || "Operation failed.", "error");
    }
  };

  const handleDelete = async (subcategoryId: string) => {
    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "This subcategory will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "glass-modal" },
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteSubcategory(subcategoryId).unwrap();
      MySwal.fire("Deleted!", "Subcategory has been removed.", "success");
      refetch();
    } catch (err: any) {
      MySwal.fire("Error!", err?.data?.message || "Failed to delete subcategory.", "error");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-base-100 text-base-content">
      <div className="mb-6 text-xl sm:text-2xl font-semibold text-primary">
        👋 Hey {firstName || "there"}, manage your subcategories here.
      </div>

      <div className="w-full max-w-5xl mx-auto bg-base-200 rounded-xl border border-base-300 shadow-lg p-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-primary">Manage Subcategories</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by subcategory name"
              className="input input-bordered w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => openSubcategoryModal()} className="btn btn-success">
              ➕ Add Subcategory
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
        ) : filteredSubcategories.length === 0 ? (
          <div className="text-center text-info text-lg">No subcategories found.</div>
        ) : (
          <table className="table table-zebra text-sm">
            <thead>
              <tr className="text-primary-content bg-primary text-xs uppercase">
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubcategories.map((sub) => (
                <tr key={sub.subcategoryId}>
                  <td>
                    {sub.imageUrl ? (
                      <img
                        src={sub.imageUrl}
                        alt={sub.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td>{sub.name}</td>
                  <td>
                    {allCategories.find((cat) => cat.categoryId === sub.categoryId)?.name || "N/A"}
                  </td>
                  <td>{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td className="space-x-2">
                    <button onClick={() => openSubcategoryModal(sub)} className="btn btn-xs btn-info">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(sub.subcategoryId)} className="btn btn-xs btn-error">
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

export default ManageSubcategories;
