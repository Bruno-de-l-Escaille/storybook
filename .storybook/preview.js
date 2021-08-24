import '@storybook/addon-console';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';


import './storybook.css';
import '../src/styles/global.scss';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});
