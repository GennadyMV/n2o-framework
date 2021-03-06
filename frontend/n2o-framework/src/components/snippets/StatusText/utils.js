import cx from 'classnames';

export const statusTextContainerStyle = (textPosition, className) => {
  return cx('n2o-status-text', className, {
    'n2o-status-text__left': textPosition === 'left',
    'n2o-status-text__right': textPosition === 'right',
  });
};

export const statusTextIconStyle = (textPosition, color) => {
  return cx(
    {
      'n2o-status-text_icon__right': textPosition === 'left',
      'n2o-status-text_icon__left': textPosition === 'right',
    },
    `bg-${color}`
  );
};
