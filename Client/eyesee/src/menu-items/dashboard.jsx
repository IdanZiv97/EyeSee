// assets
import { DashboardOutlined, FileTextOutlined, HeatMapOutlined, UploadOutlined, SettingOutlined, UserOutlined, ShopOutlined, LogoutOutlined, FileSyncOutlined} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined, 
  FileTextOutlined,
  HeatMapOutlined,
  UploadOutlined,
  SettingOutlined,
  UserOutlined,
  ShopOutlined,
  FileSyncOutlined,
  LogoutOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/dashboard/reports',
      icon: icons.FileTextOutlined,
      breadcrumbs: false
    },
    {
      id: 'heat-map',
      title: 'Heat Map',
      type: 'item',
      url: '/dashboard/heat-map',
      icon: icons.HeatMapOutlined,
      breadcrumbs: false
    },
    {
      id: 'upload',
      title: 'Upload',
      type: 'item',
      url: '/dashboard/upload',
      icon: icons.UploadOutlined,
      breadcrumbs: false
    },
    {
      id: 'jobs',
      title: 'Jobs',
      type: 'item',
      url: '/dashboard/jobs',
      icon: icons.FileSyncOutlined,
      breadcrumbs: false
    },
    {
      id: 'stores',
      title: 'Stores',
      type: 'item',
      url: '/dashboard/Stores',
      icon: icons.ShopOutlined,
      breadcrumbs: false
    },
    {
      id: 'settings',
      title: 'User',
      type: 'item',
      url: '/dashboard/settings',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'logout',
      title: 'Logout',
      type: 'item',
      url: '/login',
      icon: icons.LogoutOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
