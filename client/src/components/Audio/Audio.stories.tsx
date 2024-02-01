import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Audio} from './Audio';

const meta: Meta<typeof Audio> = {
  component: Audio,
};

export default meta;

type Story = StoryObj<typeof Audio>;

export const Basic: Story = {args: {}};
