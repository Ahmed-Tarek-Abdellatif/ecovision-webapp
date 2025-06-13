import axios from 'axios';
import { HandleLoginProps } from '../Interface/Interface';

export const handleLogin = async ({ event, email, password } : HandleLoginProps) => {
  event.preventDefault();

  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email,
      password,
    });

    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    axios.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

    alert('Login successful!');

    window.location.href = '/aqi';
  } catch (error) {
    alert('Login failed: ' + error.response.data.message);
  }
};
