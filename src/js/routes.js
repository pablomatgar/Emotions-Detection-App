import HomePage from '../pages/home.jsx';
import SettingsPage from '../pages/settings.jsx';

var routes = [
  {
    path: '/',
    component: HomePage,
    keepAlive: true,
  },
  {
    path: '/settings',
    component: SettingsPage,

  }
];

export default routes;
