const axios = require('axios');
class AuthService {
  async login(user) {
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
      user
    );
    return result.data;
  }
  async register(user) {
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/register`,
      user
    );
    return result.data;
  }
}
export default new AuthService();
