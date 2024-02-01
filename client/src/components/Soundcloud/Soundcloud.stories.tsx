import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Soundcloud} from './Soundcloud';

const meta: Meta<typeof Soundcloud> = {
  component: Soundcloud,
};

export default meta;

type Story = StoryObj<typeof Soundcloud>;

export const Basic: Story = {args: {}};
