import PropTypes from 'prop-types';
import { SHOW_ALL, SHOW_CHILD, SHOW_PARENT } from 'rc-tree-select';
import { intlShape } from 'react-intl';

export const defaultProps = {
  children: null,
  intl: intlShape.isRequired,
  hasChildrenFieldId: 'hasChildren',
  disabled: false,
  loading: false,
  parentFieldId: 'parentId',
  valueFieldId: 'id',
  labelFieldId: 'name',
  iconFieldId: 'icon',
  imageFieldId: 'image',
  badgeFieldId: 'badge',
  badgeColorFieldId: 'color',
  filter: 'startsWith',
  hasCheckboxes: false,
  multiSelect: false,
  closePopupOnSelect: false,
  data: [],
  notFoundContent: 'Ничего не найдено',
  searchPlaceholder: '',
  transitionName: 'slide-up',
  choiceTransitionName: 'zoom',
  showCheckedStrategy: SHOW_ALL,
  allowClear: true,
  placeholder: '',
  showSearch: true,
  dropdownPopupAlign: {
    points: ['tl', 'bl'],
    overflow: {
      adjustY: true
    }
  },
  onSearch: () => {},
  onSelect: () => {},
  onChange: () => {},
  onClose: () => {},
  onToggle: () => {},
  onOpen: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

export const propTypes = {
  children: PropTypes.node,
  hasChildrenFieldId: PropTypes.string,
  parentFieldId: PropTypes.string,
  loading: PropTypes.bool,
  data: PropTypes.array,
  valueFieldId: PropTypes.string,
  labelFieldId: PropTypes.string,
  iconFieldId: PropTypes.string,
  imageFieldId: PropTypes.string,
  badgeFieldId: PropTypes.string,
  badgeColorFieldId: PropTypes.string,
  groupFieldId: PropTypes.string,
  disabled: PropTypes.bool,
  disabledValues: PropTypes.array,
  filter: PropTypes.oneOf(['includes', 'startsWith', 'endsWith', 'server']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onInput: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  multiSelect: PropTypes.bool,
  closePopupOnSelect: PropTypes.bool,
  hasCheckboxes: PropTypes.bool,
  format: PropTypes.string,
  collapseSelected: PropTypes.bool,
  lengthToGroup: PropTypes.number,
  onSearch: PropTypes.func,
  expandPopUp: PropTypes.bool,
  ajax: PropTypes.bool,
  handleItemOpen: PropTypes.func,
  dropdownPopupAlign: PropTypes.object
};
