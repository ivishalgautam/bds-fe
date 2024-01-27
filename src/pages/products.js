import React, { useState } from "react";
import Title from "../components/Title";
import Spinner from "../components/Spinner";
import http from "../utils/http";
import { endpoints } from "../utils/endpoints";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import ProductForm from "../components/Forms/ProductForm";
import Modal from "../components/Modal";
import { AiOutlinePlus } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import toast from "react-hot-toast";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/table/Pagination";

const fetchProducts = () => {
  return http().get(endpoints.products.getAll);
};

const deleteItem = async (itemId) => {
  await http().delete(`${endpoints.products.getAll}/${itemId}`);
};

const createItem = async (newItem) => {
  await http().post(endpoints.products.getAll, newItem);
};

const updateItem = async (itemId, updatedItem) => {
  await http().put(`${endpoints.products.getAll}/${itemId}`, updatedItem);
};

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const [type, setType] = useState(null);
  const [show, setShow] = useState(false);

  const toggleDropdown = (id) => {
    setShow((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const {
    params,
    pathname,
    router,
    totalPages,
    resultsToShow,
    setResultsToShow,
    startIndex,
    endIndex,
  } = usePagination({ data: data, perPage: 5 });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted.");
    },
    onError: () => {
      toast.error("Failed to delete Product.");
    },
  });

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  const createMutation = useMutation(createItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully.");
    },
    onError: () => {
      toast.error("Failed to create Product.");
    },
  });

  const handleCreate = (newItem) => {
    createMutation.mutate(newItem);
  };

  const updateMutation = useMutation(
    (updatedItem) => updateItem(productId, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Product updated successfully.");
      },
      onMutate: (data) => {
        const newData = resultsToShow?.map((item) => {
          if (item.id === productId) {
            return { id: productId, ...data };
          }
          return item;
        });
        setResultsToShow(newData);
      },
      onError: () => {
        toast.error("Failed to update Product.");
      },
    }
  );

  const handleUpdate = (updatedItem) => {
    updateMutation.mutate(updatedItem);
  };

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <h2>{error?.message}</h2>;

  return (
    <div className="space-y-6">
      <Title text="Products" />
      <div className="grid grid-cols-3 gap-8 pb-24">
        <div
          className="bg-white p-4 rounded-xl space-y-4 flex justify-center items-center cursor-pointer"
          onClick={() => {
            setType("add");
            openModal();
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <AiOutlinePlus className="text-6xl bg-primary p-2 text-white rounded-full" />
            <p>Add New Product</p>
          </div>
        </div>
        {resultsToShow?.slice(startIndex, endIndex)?.map((product) => (
          <div
            className="bg-white rounded-xl"
            onMouseLeave={() => setShow(false)}
            key={product.id}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${product.thumbnail}`}
              alt=""
              className="h-48 w-full object-cover rounded-t-xl"
            />

            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">{product.title}</h3>
                {/* <p className="text-primary">Age{product.age}</p> */}
                <div className="relative">
                  <FiMoreVertical
                    onClick={() => toggleDropdown(product.id)}
                    className="cursor-pointer"
                  />
                  {show[product.id] && (
                    <div className="absolute top-4 right-0 mt-2 bg-white rounded-lg shadow-md">
                      <ul className="py-2 max-w-max">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                          onClick={() => {
                            openModal();
                            setType("edit");
                            setProductId(product.id);
                          }}
                        >
                          <MdModeEditOutline />
                          Edit
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                          onClick={() => {
                            openModal();
                            setType("view");
                            setProductId(product.id);
                          }}
                        >
                          <BsFillEyeFill />
                          View
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                          onClick={() => handleDelete(product.id)}
                        >
                          <FaTrashAlt />
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <p>{product.short_description}</p>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 0 && (
        <Pagination
          params={params}
          router={router}
          pathname={pathname}
          resultsToShow={resultsToShow}
          endIndex={endIndex}
          totalPages={totalPages}
        />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ProductForm
          handleCreate={handleCreate}
          closeModal={closeModal}
          productId={productId}
          type={type}
          handleUpdate={handleUpdate}
        />
      </Modal>
    </div>
  );
}
