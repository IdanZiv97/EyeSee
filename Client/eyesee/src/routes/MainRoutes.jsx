import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { element } from 'prop-types';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const Reports = Loadable(lazy(() => import('pages/reports/reports-container')));
const HeatMap = Loadable(lazy(() => import('pages/heat-map/heat-map')));
const Upload = Loadable(lazy(() => import('pages/upload/upload-video')));
const User = Loadable(lazy(() => import('pages/User/User')));
const Stores = Loadable(lazy(() => import('pages/stores/stores')));
const Jobs = Loadable(lazy(() => import('pages/jobs/jobs')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/dashboard',
  element: <Dashboard />,
  children: [
    {
      path: 'default',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'reports',
      element: <Reports />
    },
    {
      path: 'heat-map',
      element: <HeatMap />
    },
    {
      path: 'upload',
      element: <Upload />
    },
    {
      path: 'jobs',
      element: <Jobs/>
    },
    {
      path: 'stores',
      element: <Stores/>
    },
    {
      path: 'settings',
      element: <User />
    }
  ]
};

export default MainRoutes;
