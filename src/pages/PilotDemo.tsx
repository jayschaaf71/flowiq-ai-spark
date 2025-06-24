
import { Layout } from '@/components/Layout';
import { PatientLifecycleDemonstration } from '@/components/demo/PatientLifecycleDemonstration';

const PilotDemo = () => {
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <PatientLifecycleDemonstration />
      </div>
    </Layout>
  );
};

export default PilotDemo;
