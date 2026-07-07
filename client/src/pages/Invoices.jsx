import { useEffect, useState } from "react";
import {
  createInvoice,
  getCustomers,
  getInvoices,
  getProducts,
  toggleInvoiceStatus,
} from "../api";
import Modal from "../components/Modal";
import Table from "../components/Table";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    customerId: "",
    items: [{ productId: "", qty: 1 }],
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = async () => {
    try {
      // Fetch customers and products only when modal opens to save initial load time
      const [custData, prodData] = await Promise.all([
        getCustomers(),
        getProducts(),
      ]);
      setCustomers(custData);
      setProducts(prodData);
      setFormData({ customerId: "", items: [{ productId: "", qty: 1 }] });
      setIsModalOpen(true);
    } catch (err) {
      alert("Failed to load form data");
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === "qty" ? parseInt(value) : value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: "", qty: 1 }],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Live total calculation
  const liveTotal = formData.items.reduce((sum, item) => {
    const product = products.find((p) => p._id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInvoice(formData);
      setIsModalOpen(false);
      fetchInvoices();
    } catch (err) {
      alert("Failed to create invoice");
    }
  };

  const handleToggleStatus = async (id) => {
    await toggleInvoiceStatus(id);
    fetchInvoices();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <button
          onClick={openModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Invoice
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
          No invoices found. Click "Create Invoice" to make one.
        </div>
      ) : (
        <Table headers={["Date", "Customer", "Total", "Status", "Action"]}>
          {invoices.map((inv) => (
            <tr key={inv._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(inv.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {inv.customerId?.name || "Unknown"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${inv.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${inv.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                >
                  {inv.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleToggleStatus(inv._id)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Mark as {inv.status === "paid" ? "Unpaid" : "Paid"}
                </button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Invoice"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <select
              required
              value={formData.customerId}
              onChange={(e) =>
                setFormData({ ...formData, customerId: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Line Items
            </h3>
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <select
                    required
                    value={item.productId}
                    onChange={(e) =>
                      handleItemChange(index, "productId", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} (${p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 font-bold px-2"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              + Add Item
            </button>
          </div>

          <div className="flex justify-between items-center border-t pt-4 mt-4">
            <span className="text-lg font-semibold text-gray-800">
              Live Total:
            </span>
            <span className="text-xl font-bold text-indigo-600">
              ${liveTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
