import React from 'react';
import { GuideLayout } from '../../components/guide-ui';
import DocRenderer from '../../components/guide-ui/DocRenderer';
import { DocPage } from '../../types/docs';

interface TemplatePageProps {
  data: DocPage;
}

const TemplatePage: React.FC<TemplatePageProps> = ({ data }) => {
  return (
    <GuideLayout
      title={data.title}
      description={data.description}
      breadcrumbs={data.breadcrumbs}
      metadata={data.metadata}
      backgroundImage="/Hp_Omen_image.avif" // Could be dynamic too
    >
      <DocRenderer data={data} />
    </GuideLayout>
  );
};

export default TemplatePage;
