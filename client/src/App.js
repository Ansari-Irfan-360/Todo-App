import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, ListGroup, InputGroup, Card } from 'react-bootstrap';
import { PencilSquare, Trash, PlusCircle, CheckCircle } from 'react-bootstrap-icons';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function App() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [editText, setEditText] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/`);
      setTodoList(res.data);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    }
  };

  const addTodo = async () => {
    if (todo.trim().length < 3) return alert('Minimum 3 characters required');
    try {
      await axios.post(`${BACKEND_URL}/create`, { todo });
      setTodo('');
      fetchTodos();
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const updateTodo = async () => {
    if (!editId || editText.trim().length < 3) return;
    try {
      await axios.put(`${BACKEND_URL}/update/${editId}`, { todo: editText });
      setTodoList((prevList) =>
        prevList.map((item) =>
          item.id === editId ? { ...item, todo: editText } : item
        )
      );
      setEditId(null);
      setEditText('');
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      setTodoList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const buttonStyle = {
    background: 'linear-gradient(to right, #00c6ff, #0072ff)',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    padding: '6px 12px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const inputStyle = {
    backgroundColor: '#2e2f3e',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '8px'
  };

  return (
    <div style={{
      background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg rounded-4 border-0" style={{ backgroundColor: '#1e1f2f' }}>
              <Card.Body>
                <h2 className="text-center text-light mb-4">🚀 Sleek Todo App</h2>
                <InputGroup className="mb-4">
                  <Form.Control
                    placeholder="What needs to be done?"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    style={inputStyle}
                  />
                  <Button onClick={addTodo} style={buttonStyle} title="Add">
                    <PlusCircle size={20} className="me-1" /> Add
                  </Button>
                </InputGroup>

                <ListGroup variant="flush">
                  {todoList.map((item) => (
                    <ListGroup.Item
                      key={item.id}
                      className="d-flex justify-content-between align-items-center py-3"
                      style={{ backgroundColor: '#2b2c3b', color: '#f8f9fa', border: 'none' }}
                    >
                      {editId === item.id ? (
                        <InputGroup>
                          <Form.Control
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            style={inputStyle}
                          />
                          <Button onClick={updateTodo} style={buttonStyle} title="Save">
                            <CheckCircle size={20} className="me-1" /> Save
                          </Button>
                        </InputGroup>
                      ) : (
                        <>
                          <span>{item.todo}</span>
                          <div className="d-flex gap-2">
                            <Button
                              style={buttonStyle}
                              size="sm"
                              onClick={() => { setEditId(item.id); setEditText(item.todo); }}
                              title="Edit"
                            >
                              <PencilSquare size={16} className="me-1" /> Edit
                            </Button>
                            <Button
                              style={{ ...buttonStyle, background: 'linear-gradient(to right, #ff416c, #ff4b2b)' }}
                              size="sm"
                              onClick={() => deleteTodo(item.id)}
                              title="Delete"
                            >
                              <Trash size={16} className="me-1" /> Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
