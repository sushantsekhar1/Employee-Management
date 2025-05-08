import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:5000/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    salary: "",
    address: "",
    department_id: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API}/departments`);
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId === null) {
        await axios.post(`${API}/employees`, form);
      } else {
        await axios.put(`${API}/employees/${editId}`, form);
        setEditId(null);
      }
      setForm({ name: "", email: "", salary: "", address: "", department_id: "" });
      fetchEmployees();
    } catch (error) {
      console.error("Error submitting employee form:", error);
    }
  };

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      email: emp.email,
      salary: emp.salary,
      address: emp.address,
      department_id: emp.department_id,
    });
    setEditId(emp.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="container mt-5 justify-content-center align-items-center d-flex flex-column w-100 h-100 bg-light p-4 rounded shadow text-center text-dark border border-2 border-primary">
      <h2 className="mb-3">Employee Management</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Salary"
          type="number"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <select
          className="form-control mb-2"
          value={form.department_id}
          onChange={(e) => setForm({ ...form, department_id: e.target.value })}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.id}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" type="submit">
          {editId === null ? "Add Employee" : "Update Employee"}
        </button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Address</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.salary}</td>
              <td>{emp.address}</td>
              <td>
                {departments.find((d) => d.id === emp.department_id)?.name ||
                  "N/A"}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => handleEdit(emp)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(emp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;