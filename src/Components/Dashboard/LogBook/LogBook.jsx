import React, { useState, useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import {
  useCreateLogBookMutation,
  useDeleteLogBookMutation,
  useGetLogBookQuery,
  useUpdateLogBookMutation,
} from "../../../redux/baseApi/baseApi";
import Swal from "sweetalert2";

const LogBook = () => {
  const [showForm, setShowForm] = useState(false);
  const [newLog, setNewLog] = useState({
    task: "",
    description: "",
    priority: "medium",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentLogId, setCurrentLogId] = useState(null);

  // RTK Query hooks
  const {
    data: logData,
    isLoading: isLoadingLogs,
    refetch,
  } = useGetLogBookQuery();
  const [createLogBook, { isLoading: isCreating }] = useCreateLogBookMutation();
  const [deleteLogBook, { isLoading: isDeleting }] = useDeleteLogBookMutation();
  const [updateLogBook, { isLoading: isUpdating }] = useUpdateLogBookMutation();

  const logs = logData?.data || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLog({
      ...newLog,
      [name]: value,
    });
  };

  const resetForm = () => {
    setNewLog({
      task: "",
      description: "",
      priority: "medium",
    });
    setEditMode(false);
    setCurrentLogId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        // Update existing log
        await updateLogBook({
          id: currentLogId,
          data: newLog,
        }).unwrap();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Log updated successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Create new log
        await createLogBook(newLog).unwrap();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Log added successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      refetch(); // Refetch logs after mutation
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Something went wrong",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteLogBook(id).unwrap();
          refetch();

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Log has been deleted.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to delete log",
      });
    }
  };

  const handleEdit = (log) => {
    setNewLog({
      task: log.task,
      description: log.description,
      priority: log.priority || "medium",
    });
    setCurrentLogId(log._id);
    setEditMode(true);
    setShowForm(true);
  };

  const handleView = (log) => {
    Swal.fire({
      title: log.task,
      html: `
        <div class="text-left">
          <p><strong>Description:</strong> ${log.description}</p>
          <p><strong>Priority:</strong> ${log.priority}</p>
          <p><strong>Created:</strong> ${new Date(
            log.createdAt
          ).toLocaleString()}</p>
        </div>
      `,
      confirmButtonText: "Close",
    });
  };

  // Calculate row height based on padding and content
  const rowHeight = 26; // Approximate height of each row in pixels
  const tableHeaderHeight = 0; // No header height
  const maxVisibleRows = 5;
  const tableHeight = rowHeight * maxVisibleRows;

  // Get current date for display
  const currentDate = new Date()
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
    .replace(/\//g, "-");

  if (isLoadingLogs) {
    return (
      <div className="p-2 max-w-6xl mx-auto border rounded-lg shadow-sm">
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-6xl mx-auto border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xs font-bold text-gray-800">
          Log Book ({currentDate})
        </h1>
        <button
          onClick={() => {
            if (showForm && editMode) {
              resetForm();
            } else {
              setShowForm(!showForm);
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded flex items-center"
        >
          {showForm ? (editMode ? "Cancel Edit" : "Cancel") : "+"}
        </button>
      </div>

      {/* Form for adding/editing log */}
      {showForm && (
        <div className="mb-2 p-2 bg-gray-50 rounded">
          <form onSubmit={handleSubmit} className="text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  For
                </label>
                <input
                  type="text"
                  name="task"
                  value={newLog.task}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  What
                </label>
                <input
                  type="text"
                  name="description"
                  value={newLog.description}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={newLog.priority}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex items-end mt-2">
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className={`${
                    editMode
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white px-2 py-1 text-xs rounded flex items-center`}
                >
                  {isCreating || isUpdating ? (
                    <span className="mr-1">
                      <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full inline-block"></div>
                    </span>
                  ) : null}
                  {editMode ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Logbook table with fixed height and scrolling */}
      <div
        className="overflow-x-auto overflow-y-auto bg-white rounded"
        style={{ maxHeight: `${tableHeight}px` }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="px-2 py-1 whitespace-nowrap text-xs font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-xs font-semibold">
                  {log.task}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-xs font-semibold text-gray-500">
                  {log.description}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-xs">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-white ${
                      log.priority === "high"
                        ? "bg-red-500"
                        : log.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {log.priority}
                  </span>
                </td>
                <td className="pl-2 py-1 whitespace-nowrap text-xs font-medium">
                  <button
                    onClick={() => handleView(log)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-1 py-1 rounded mr-1"
                  >
                    <FaEye size={10} />
                  </button>
                  <button
                    onClick={() => handleEdit(log)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-1 py-1 rounded mr-1"
                  >
                    <FaEdit size={10} />
                  </button>
                  <button
                    onClick={() => handleDelete(log._id)}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded"
                  >
                    <FaTrash size={10} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="text-center py-2 text-xs text-gray-500">
          No logs found. Click the "+" button to add a new log.
        </div>
      )}
    </div>
  );
};

export default LogBook;
