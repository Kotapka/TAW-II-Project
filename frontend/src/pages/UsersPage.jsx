import React, { useState, useEffect } from 'react';
import styles from './Statistics.module.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import UserActions from '../components/UserActions';

function UsersPage() {
  const [apiData, setApiData] = useState([]);
  const [showUserStatus, setShowUserStatus] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'login', headerName: 'Login', width: 150 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'surname', headerName: 'Surname', width: 150 },
    { field: 'isActive', headerName: 'IsActive', width: 150 },
  ];

  const handleLogout = () => {
    try {
      const token = Cookies.get('jwtToken');
      Cookies.remove('jwtToken');
      Cookies.remove('Login');
      navigate('/');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handlePlannerPage = () => {
    try {
      navigate('/PlannerPage');
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('jwtToken');
        const response = await axios.get('http://localhost:8080/api/getUsers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setApiData(
            response.data.map((row) => ({
              id: row.id,
              login: row.login,
              name: row.name,
              surname: row.surname,
              isActive: row.is_active
            }))
          );
        } else {
          console.error('Error loading statistics: Response data is not an array.');
        }
      } catch (error) {
        console.error('Error loading statistics:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleDownloadCSV = () => {
    if (apiData.length > 0) {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "id,login,name,surname\n" +
        apiData.map((row) => `${row.id},${row.login},${row.name},${row.surname}`).join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'statistics.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('No data to download');
    }
  };
  const handleUserStatus = () => {
    setShowUserStatus(true)
  };
  const handleUserStatusClose = () => {
    setShowUserStatus(false)
    window.location.reload()
  };

  return (
    <div className={styles['statistics-container']}>
      <div className={styles['side-panel']}>
        <h2>PlannerApp</h2>
        <div className={styles['logo']}>{}</div>
        <div className={styles['action-buttons-container']}>
        <button onClick={handleUserStatus} className={styles['logout-button']}>
            Change user status
          </button>
          <button onClick={handleDownloadCSV} className={styles['logout-button']}>
            Download CSV
          </button>
          <button onClick={handlePlannerPage} className={styles['logout-button']}>
            Planner
          </button>
          <button onClick={handleLogout} className={styles['logout-button']}>
            Logout
          </button>
        </div>
      </div>
      <Box className={styles['data-grid-container']} sx={{ height: '100%', width: '100%' }}>
        <DataGrid rows={apiData} columns={columns} pageSize={5} disableRowSelectionOnClick />
      </Box>
      <div>     
         {showUserStatus && <UserActions onClose={() => handleUserStatusClose()} />}
      </div>
    </div>
  );
}

export default UsersPage;
