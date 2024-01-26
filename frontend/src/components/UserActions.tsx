import React, { useState } from 'react';
import axios from 'axios';
import styles from './UserActions.module.css';

interface UserActionsProps {
  onClose: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ onClose }) => {
  const [login, setLogin] = useState('');

  const handleRequest = async (endpoint: string) => {
    try {
      const response = await axios.post(endpoint, { login });
      console.log(response.data); // Możesz obsłużyć odpowiedź z serwera, jeśli to konieczne
      onClose();
    } catch (error) {
      console.error('Błąd podczas wysyłania żądania:', error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.userActionsForm}>
        <h3>User Actions</h3>
        <form>
          <label>
            Login:
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className={styles.inputField}
            />
          </label>
          <div className={styles.buttonContainer}>
            <button type="button" onClick={() => handleRequest('http://localhost:8080/api/setActiveTrue')} className={styles.activateButton}>
              Activate
            </button>
            <button type="button" onClick={() => handleRequest('http://localhost:8080/api/setActiveFalse')} className={styles.deactivateButton}>
              Deactivate
            </button>
          </div>
        </form>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UserActions;
