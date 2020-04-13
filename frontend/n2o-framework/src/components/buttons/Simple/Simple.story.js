import React from 'react';
import { storiesOf } from '@storybook/react';

import SimpleButton from '../Simple/Simple';
import StandardButton from '../StandardButton/StandardButton';
import Toolbar from '../Toolbar';

const stories = storiesOf('Кнопки/SimpleButton', module);

const toolbar = [
  {
    buttons: [
      {
        id: 'testBtn22',
        src: 'StandardButton',
        rounded: true,
        icon: 'fa fa-fax',
      },
      {
        id: 'testBtn23',
        label: 'Еще кнопка',
        src: 'StandardButton',
      },
    ],
  },
];

const toolbar2 = [
  {
    buttons: [
      {
        id: 'testBtn22',
        src: 'StandardButton',
        rounded: true,
        icon: 'fa fa-adjust',
        color: 'primary',
      },
      {
        id: 'testBtn22',
        src: 'StandardButton',
        rounded: true,
        icon: 'fa fa-address-book',
        color: 'primary',
      },
      {
        id: 'testBtn23',
        label: 'Еще кнопка',
        src: 'StandardButton',
      },
      {
        id: 'testBtn23',
        label: 'Еще кнопка',
        src: 'StandardButton',
      },
    ],
  },
];

const toolbar3 = [
  {
    buttons: [
      {
        id: 'testBtn22',
        src: 'StandardButton',
        rounded: true,
        icon: 'fa fa-adjust',
        color: 'success',
      },
      {
        id: 'testBtn22',
        src: 'StandardButton',
        rounded: true,
        icon: 'fa fa-address-book',
        color: 'success',
      },
      {
        id: 'testBtn22',
        src: 'StandardButton',
        rounded: true,
        icon: 'fa fa-phone',
        color: 'success',
      },
      {
        id: 'testBtn22',
        src: 'StandardButton',
        rounded: true,
        icon: 'fa fa-fax',
        color: 'success',
      },
    ],
  },
];

const meta = {
  hint: 'Всплывающая подсказка',
  visible: true,
  rounded: true,
  disabled: false,
  icon: 'fa fa-plus',
  size: 'sm',
  color: 'primary',
  action: {
    type: 'n2o/button/Dummy',
  },
};

const meta1 = {
  hint: 'Всплывающая подсказка',
  visible: true,
  rounded: true,
  disabled: false,
  icon: 'fa fa-bolt',
  size: 'md',
  color: 'primary',
  action: {
    type: 'n2o/button/Dummy',
  },
};

const meta2 = {
  hint: 'Всплывающая подсказка',
  visible: true,
  rounded: true,
  disabled: false,
  icon: 'fa fa-plus',
  size: 'lg',
  color: 'primary',
  action: {
    type: 'n2o/button/Dummy',
  },
};

const performMeta = {
  hint: 'Всплывающая подсказка',
  confirm: {
    cancelLabel: 'Нет',
    okLabel: 'Да',
    text: "`'Выполнить действие над '+name+'?'`",
    title: 'Предупреждение',
  },
  visible: true,
  rounded: true,
  disabled: false,
  icon: 'fa fa-bolt',
  size: 'md',
  color: 'primary',
  action: {
    type: 'n2o/button/Dummy',
  },
};

stories
  .add('SimpleButton', () => (
    <div>
      <SimpleButton {...meta} />
      <SimpleButton {...meta} icon={'fa fa-minus'} />
      <SimpleButton {...meta1} />
      <SimpleButton {...meta1} icon={'fa fa-minus'} />
      <SimpleButton {...meta2} />
      <SimpleButton {...meta2} icon={'fa fa-minus'} />
    </div>
  ))
  .add('SimpleButton in StandardButton', () => (
    <div>
      <StandardButton {...performMeta} />
    </div>
  ))
  .add('В Toolbar', () => (
    <div style={{ display: 'flex' }}>
      <Toolbar toolbar={toolbar} entityKey="metaBtns" />
      <Toolbar toolbar={toolbar2} entityKey="metaBtns" />
      <Toolbar toolbar={toolbar3} entityKey="metaBtns" />
    </div>
  ));
