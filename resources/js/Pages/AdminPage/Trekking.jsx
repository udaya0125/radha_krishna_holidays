import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
    Plus,
    Edit,
    Trash2,
} from "lucide-react";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import AddTrekkingForm from "@/AddComponents/AddTrekkingForm";
import EditTrekkingForm from "@/EditComponents/EditTrekkingForm";
import MyTable from "@/MyTable/MyTable";

const Trekking = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [allTrekking, setAllTrekking] = useState([]);
    const [allTrekkingCategory, setAllTrekkingCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTrekking, setEditingTrekking] = useState(null);
    const [loading, setLoading] = useState(true);

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Title",
                accessor: "title",
            },
            {
                Header: "Category",
                Cell: ({ row }) => (
                    <p>{row.original?.category?.category || "N/A"}</p>
                ),
            },
            {
                Header: "Sub Category",
                Cell: ({ row }) => (
                    <p>{row.original?.sub_category?.sub_category || "N/A"}</p>
                ),
            },
            {
                Header: "Duration",
                accessor: "duration",
            },
            {
                Header: "Highest Elevation",
                accessor: "elevation",
            },
            {
                Header: "Grade",
                accessor: "grade",
            },
            {
                Header: "Season",
                accessor: "season",
            },
            {
                Header: "Actions",
                accessor: "actions",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    useEffect(() => {
        const fetchTrekkings = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourtrekking.index"));
                const trekkingData = Array.isArray(response.data)
                    ? response.data
                    : response.data.data || [];
                setAllTrekking(
                    trekkingData.map((trekking) => ({
                        ...trekking,
                        images: trekking.images || [],
                        itineraries: trekking.itineraries || [],
                    }))
                );
            } catch (error) {
                console.error("Fetching error", error);
                setAllTrekking([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrekkings();

        const fetchCategory = async () => {
            try {
                const response = await axios.get(
                    route("categorywithsubcategory.indexWithSubCategory")
                );
                setAllTrekkingCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
                setAllTrekkingCategory([]);
            }
        };
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this trekking?"))
            return;
        try {
            await axios.delete(route("ourtrekking.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting trekking. Please try again.");
        }
    };

    const handleEdit = (trekking) => {
        setEditingTrekking(trekking);
        setShowEditForm(true);
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
        setReloadTrigger((prev) => !prev);
    };

    const handleEditSuccess = () => {
        setShowEditForm(false);
        setEditingTrekking(null);
        setReloadTrigger((prev) => !prev);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setEditingTrekking(null);
    };

    return (
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                        <div className="flex items-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Trekking Management
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-2 md:mt-0 py-2 md:py-3 px-4 md:px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={18} className="hidden md:block" />
                            <span>Add Trekking</span>
                        </button>
                    </div>

                    {showAddForm && (
                        <AddTrekkingForm
                            showAddForm={showAddForm}
                            onCancel={handleCancel}
                            onSuccess={handleAddSuccess}
                            allTrekkingCategory={allTrekkingCategory}
                        />
                    )}

                    {showEditForm && (
                        <EditTrekkingForm
                            showEditForm={showEditForm}
                            onCancel={handleCancel}
                            onSuccess={handleEditSuccess}
                            allTrekkingCategory={allTrekkingCategory}
                            editingTrekking={editingTrekking}
                        />
                    )}

                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : (
                        <MyTable
                            columns={columns} 
                            data={allTrekking} 
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default Trekking;