const React = require('react');

const mockNavigate = jest.fn();

module.exports = {
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to, className }) => 
    React.createElement('a', { href: to, className }, children),
  BrowserRouter: ({ children }) => React.createElement('div', {}, children),
  Route: ({ children }) => React.createElement('div', {}, children),
  Routes: ({ children }) => React.createElement('div', {}, children),
  mockNavigate,
};
