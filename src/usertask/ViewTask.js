import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const ViewTask = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.userId !== user?.id) {
          setError("❌ You are not authorized to view this task.");
        } else {
          setTask(res.data);
        }
      } catch (err) {
        setError("⚠️ Error fetching task details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTask();
    }
  }, [id, user]);

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Task Details</h3>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : task ? (
        <div className="card p-4 shadow">
          <h5 className="mb-3">
            <strong>Title:</strong> {task.title}
          </h5>
          <p className="mb-2">
            <strong>Description:</strong> {task.description}
          </p>
          <p className="mb-4">
            <strong>Status:</strong> {task.status}
          </p>
          <Link to="/user/tasks" className="btn btn-primary">
            ⬅ Back to Tasks
          </Link>
        </div>
      ) : (
        <p className="text-center">Task not found.</p>
      )}
    </div>
  );
};

export default ViewTask;
