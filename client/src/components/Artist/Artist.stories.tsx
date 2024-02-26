import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Artist} from './Artist';

const meta: Meta<typeof Artist> = {
  component: Artist,
};

export default meta;

type Story = StoryObj<typeof Artist>;

export const Basic: Story = {args: {}};
