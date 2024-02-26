import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Gallery} from './Gallery';

const meta: Meta<typeof Gallery> = {
  component: Gallery,
};

export default meta;

type Story = StoryObj<typeof Gallery>;

export const Basic: Story = {args: {}};
