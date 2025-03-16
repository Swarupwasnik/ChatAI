const { Injectable } = require('@nestjs/common');
const jwt = require('jsonwebtoken');
const config = require('../config/configuration');

@Injectable()
class AuthService {
  async validateUser(username, password) {
    // Mock user data
    const mockUser = {
      id: 1,
      username: 'testuser',
      password: 'testpass' // In real app, use hashed passwords
    };

    if (username === mockUser.username && password === mockUser.password) {
      return mockUser;
    }
    return null;
  }

  login(user) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' })
    };
  }
}

module.exports = AuthService;