import { Route } from 'react-router-dom';
import DeploymentStatus from '@/pages/DeploymentStatus';

export const deploymentRoutes = (
  <Route path="/deployment" element={<DeploymentStatus />} />
);