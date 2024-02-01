import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Analyzer} from './Analyzer';

const meta: Meta<typeof Analyzer> = {
  component: Analyzer,
};

export default meta;

type Story = StoryObj<typeof Analyzer>;

export const Basic: Story = {args: {}};
