

import { useEffect, useState } from "react";

const API_URL = "/api/students";

function App() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: ""
  });

  const [editingId, setEditingId] = useState(null);

  // =========================
  // GET students
  // =========================

  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // Input change
  // =========================

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  // =========================
  // POST / PUT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setForm({
        studentId: "",
        name: "",
        email: ""
      });

      setEditingId(null);

      fetchStudents();
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // =========================
  // Edit
  // =========================

  const handleEdit = (student) => {
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });

    setEditingId(student._id);
  };

  // =========================
  // Delete
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sinh viên này?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      fetchStudents();
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Quản lý sinh viên</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="studentId"
          placeholder="MSSV"
          value={form.studentId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Cập nhật" : "Thêm sinh viên"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);

              setForm({
                studentId: "",
                name: "",
                email: ""
              });
            }}
          >
            Hủy
          </button>
        )}
      </form>

      <table border="1" cellPadding="10" style={styles.table}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>

              <td>
                <button onClick={() => handleEdit(student)}>
                  Sửa
                </button>

                <button
                  onClick={() => handleDelete(student._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    fontFamily: "Arial"
  },

  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};

export default App;
