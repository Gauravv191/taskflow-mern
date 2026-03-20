import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: token },
      });
      setTasks(res.data);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  // Add new task
  const addTask = async () => {
    if (!title) return;

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title },
        { headers: { Authorization: token } }
      );
      setTitle("");
      fetchTasks();
    } catch (error) {
      console.log("Error adding task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: token },
      });
      fetchTasks();
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  // Toggle task (complete/incomplete)
  const toggleTask = async (task) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: token } }
      );
      fetchTasks();
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Task Dashboard</h2>

      {/* Add Task */}
      <input
        placeholder="New Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTask}>Add</button>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ margin: "10px 0" }}>
            {task.title} - {task.completed ? "✅" : "❌"}

            <button
              onClick={() => toggleTask(task)}
              style={{ marginLeft: "10px" }}
            >
              Toggle
            </button>

            <button
              onClick={() => deleteTask(task._id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;