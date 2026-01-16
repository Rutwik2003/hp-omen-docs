import React from 'react';
import TemplatePage from '../TemplatePage';
import data from '../../../content/quickstart/unboxing-setup.json';
import { DocPage } from '../../../types/docs';

const UnboxingSetup: React.FC = () => {
  return <TemplatePage data={data as unknown as DocPage} />;
};

export default UnboxingSetup;

