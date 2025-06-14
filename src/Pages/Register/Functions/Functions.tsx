import axios from 'axios';
import { HandleRegisterProps } from '../Interface/Interface';

export const handleRegister = async ({ event, username, email, password, phone }: HandleRegisterProps) => {
  event.preventDefault();

  try {
    const response = await axios.post('http://localhost:3000/auth/register', {
      username,
      email,
      password,
      phone,
    });

    alert('User created successfully!');
    window.location.href = '/login';
  } catch (error) {
    alert('Registration failed: ' + error.response.data.message);
  }
};
