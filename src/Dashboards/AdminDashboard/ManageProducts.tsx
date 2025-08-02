import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { PuffLoader } from "react-spinners";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

import { subcategoryApi } from "../../Features/Apis/SubCategoryApi";
import { productApi } from "../../Features/Apis/ProductApi";
import type { RootState } from "../../App/store";

const MySwal = withReactContent(Swal);

interface Product {
  productId: number;
  title: string;
  description?: string;
  price: number | string;
  stock: number | string;
  subcategoryId: number;
  createdAt?: string;
}

const ManageProducts = () => {
  const {
    data: allProductsResponse,
    isLoading,
    error,
    refetch,
  } = productApi.useGetAllProductsQuery({});

  const { data: subcategories = [] } = subcategoryApi.useGetAllSubcategoriesQuery();

  const [createProduct] = productApi.useCreateProductMutation();
  const [updateProduct] = productApi.useUpdateProductMutation();
  const [deleteProduct] = productApi.useDeleteProductMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const userFirstName = useSelector((state: RootState) => state.auth.user?.firstName);

  const productList = Array.isArray(allProductsResponse)
    ? allProductsResponse
    : allProductsResponse?.allProducts || [];

  const filteredProducts = productList.filter((product: Product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = async (product?: Product) => {
    const subcategoryOptions = subcategories
      .map(
        (sub: any) =>
          `<option value="${sub.subcategoryId}" ${
            sub.subcategoryId === product?.subcategoryId ? "selected" : ""
          }>${sub.name}</option>`
      )
      .join("");

    const { value } = await MySwal.fire({
      title: product ? "Edit Product" : "Add Product",
      html: `
        <input id="title" class="swal2-input" placeholder="Title" value="${product?.title || ""}" />
        <textarea id="description" class="swal2-textarea" placeholder="Description">${product?.description || ""}</textarea>
        <input id="price" type="number" class="swal2-input" placeholder="Price" value="${product?.price || ""}" />
        <input id="stock" type="number" class="swal2-input" placeholder="Stock" value="${product?.stock || ""}" />
        <select id="subcategoryId" class="swal2-select">
          <option value="">Select Subcategory</option>
          ${subcategoryOptions}
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const title = (document.getElementById("title") as HTMLInputElement).value.trim();
        const description = (document.getElementById("description") as HTMLTextAreaElement).value.trim();
        const price = parseFloat((document.getElementById("price") as HTMLInputElement).value);
        const stock = parseInt((document.getElementById("stock") as HTMLInputElement).value);
        const subcategoryId = parseInt((document.getElementById("subcategoryId") as HTMLSelectElement).value);

        if (!title || isNaN(price) || isNaN(stock) || isNaN(subcategoryId)) {
          Swal.showValidationMessage("Please fill in all fields correctly.");
          return null;
        }

        return {
          title,
          description,
          price,
          stock,
          subcategoryId,
          productId: product?.productId,
        };
      },
    });

    if (!value) return;

    try {
      if (value.productId) {
        const { productId, ...updates } = value;
        await updateProduct({ productId, ...updates }).unwrap();
        Swal.fire("Success", "Product updated!", "success");
      } else {
        await createProduct(value).unwrap();
        Swal.fire("Success", "Product created!", "success");
      }
      refetch();
    } catch (err: any) {
      Swal.fire("Error", err?.data?.message || "Something went wrong", "error");
    }
  };

  const handleDelete = async (productId: number) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteProduct(productId).unwrap();
      Swal.fire("Deleted", "Product has been deleted.", "success");
      refetch();
    } catch (err: any) {
      Swal.fire("Error", err?.data?.message || "Failed to delete product.", "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-primary">Welcome {userFirstName || "User"}</h1>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-success ml-4" onClick={() => openModal()}>
          ➕ Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <PuffLoader color="#22d3ee" />
        </div>
      ) : error ? (
        <p className="text-error">Error fetching products.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200 text-sm text-primary">
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Subcategory</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product: Product) => (
                  <tr key={product.productId}>
                    <td>{product.title}</td>
                    <td>{product.description || "—"}</td>
                    <td>
                      {typeof product.price === "number"
                        ? `$${product.price.toFixed(2)}`
                        : `$${parseFloat(product.price).toFixed(2)}`}
                    </td>
                    <td>{product.stock}</td>
                    <td>
                      {
                        subcategories.find(
                          (s: any) => s.subcategoryId === product.subcategoryId
                        )?.name || "Unknown"
                      }
                    </td>
                    <td>
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="space-x-2">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => openModal(product)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(product.productId)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
