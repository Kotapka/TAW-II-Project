import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import styles from './PlannerPage.module.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import CategoryForm from '../components/CategoryForm';
import TaskForm from '../components/TaskForm';
import AssignedTaskForm from '../components/AssignedTaskForm';
import EditAssignedTaskForm from '../components/EdditAssignedTaskForm';

const localizer = momentLocalizer(moment);

function PlannerPage() {
  const navigate = useNavigate();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAssignedTaskForm, setAssignedShowTaskForm] = useState(false);
  const [showEdditAssignedTaskForm, setShowEdditAssignedTaskForm] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasksAndCategories, setTasksAndCategories] = useState([]);

  useEffect(() => {
    loadAssignedTasks();
    loadTasksAndCategories();
  }, []);

  const fetchAssignedTasks = async () => {
    const token = Cookies.get('jwtToken');
    try {
      const response = await fetch('http://localhost:8080/api/user/getAssignedTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          login: Cookies.get('Login'),
          active: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching assigned tasks:', error.message);
    }
  };

  const convertToCalendarEvents = (tasks) => {
    const activeTasks = tasks.filter(task => task.active);

    return activeTasks.map((task) => ({
      id: task.id,
      start: new Date(task.startDate),
      end: new Date(task.endDate),
      title: task.task,
    }));
  };

  const loadAssignedTasks = async () => {
    try {
      const tasks = await fetchAssignedTasks();
      const calendarEvents = convertToCalendarEvents(tasks);
      setAssignedTasks(calendarEvents);
    } catch (error) {
    }
  };

  const fetchTasks = async () => {
    const token = Cookies.get('jwtToken');

    try {
      const response = await fetch('http://localhost:8080/api/user/getTasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          login: Cookies.get('Login'),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  const loadTasksAndCategories = async () => {
    try {
      const tasks = await fetchTasks();
      setTasksAndCategories(tasks || []);
    } catch (error) {
    }
  };

  const handleLogout = () => {
    try {
      const token = Cookies.get('jwtToken');
      Cookies.remove('jwtToken');
      Cookies.remove('Login');
      console.log("About to navigate")
      navigate('/');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleAddCategoryClick = () => {
    setShowCategoryForm(true);
  };

  const handleAddTaskClick = () => {
    setShowTaskForm(true);
  };

  const handleAddTaskClose = () => {
    setShowTaskForm(false);
    window.location.reload()
  };

  const handleDateClick = (event) => {
    const clickedDate = event.start;
    setSelectedDate(clickedDate);
    setAssignedShowTaskForm(true);
  };

  const handleEventClick = (event) => {
    setShowEdditAssignedTaskForm(true);
    setSelectedTaskId(event.id);
    setSelectedDate(event.start)
  };

  const handleAdminPage = () => {
    try {
      const userLogin = Cookies.get('Login');
      if (userLogin === 'admin') {
        console.log('Navigating to Users');
        navigate('/Users');
        navigate('/Users');
      } else {
        console.log('Unauthorized access to User Manager');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={styles['planner-container']}>
      <div className={styles['side-panel']}>
        <h2>PlannerApp</h2>
        <div>
          {tasksAndCategories && tasksAndCategories.reduce((categories, task) => {
            const existingCategory = categories.find((cat) => cat.name === task.category);

            if (existingCategory) {
              existingCategory.tasks.push(task.name);
            } else {
              categories.push({
                name: task.category,
                tasks: [task.name],
              });
            }

            return categories;
          }, []).map((category, index) => (
            <React.Fragment key={index}>
              <div>
                <strong>Category: {category.name}</strong>
              </div>
              <ul>
                {category.tasks.map((task, taskIndex) => (
                  <li key={taskIndex}>- {task}</li>
                ))}
              </ul>
            </React.Fragment>
          ))}
        </div>
        <div className={styles['action-buttons-container']}>
          <button className={styles['action-button']} onClick={handleAddCategoryClick}>
            Add Category
          </button>
          <button className={styles['action-button']} onClick={handleAddTaskClick}>
            Add Task
          </button>
          {Cookies.get('Login') === 'admin' && (
          <button onClick={handleAdminPage} className={styles['action-button']}>
            User Manager
          </button>
          )}
          <button onClick={handleLogout} className={styles['logout-button']}>
            Logout
          </button>
        </div>
      </div>
      <div className={`${styles['full-page-calendar']} ${showCategoryForm && styles['calendar-disabled']}`}>
        <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          style={{ flex: 1, height: '100%' }}
          selectable={true}
          onSelectSlot={handleDateClick}
          events={assignedTasks}
          onSelectEvent={handleEventClick}
        />
      </div>
      {showCategoryForm && <CategoryForm onClose={() => setShowCategoryForm(false)} />}
      {showTaskForm && <TaskForm onClose={() => handleAddTaskClose()} />}
      {showEdditAssignedTaskForm && <EditAssignedTaskForm taskId={selectedTaskId} selectedDate={selectedDate} onClose={() => setShowEdditAssignedTaskForm(false)} />}
      {showAssignedTaskForm && selectedDate && (
        <AssignedTaskForm
          selectedDate={selectedDate}
          onClose={() => {
            setAssignedShowTaskForm(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}

export default PlannerPage;
