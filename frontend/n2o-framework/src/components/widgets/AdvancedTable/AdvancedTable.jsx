import React, { Component } from 'react';
import { compose, pure, setDisplayName } from 'recompose';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import Table from 'rc-table';
import AdvancedTableExpandIcon from './AdvancedTableExpandIcon';
import AdvancedTableExpandedRenderer from './AdvancedTableExpandedRenderer';
import { HotKeys } from 'react-hotkeys/cjs';
import cx from 'classnames';
import propsResolver from '../../../utils/propsResolver';
import SecurityCheck from '../../../core/auth/SecurityCheck';
import find from 'lodash/find';
import some from 'lodash/some';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import forOwn from 'lodash/forOwn';
import every from 'lodash/every';
import flattenDeep from 'lodash/flattenDeep';
import isArray from 'lodash/isArray';
import findIndex from 'lodash/findIndex';
import values from 'lodash/values';
import eq from 'lodash/eq';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import includes from 'lodash/includes';
import isNumber from 'lodash/isNumber';
import AdvancedTableRow from './AdvancedTableRow';
import AdvancedTableRowWithAction from './AdvancedTableRowWithAction';
import AdvancedTableHeaderCell from './AdvancedTableHeaderCell';
import AdvancedTableEmptyText from './AdvancedTableEmptyText';
import CheckboxN2O from '../../controls/Checkbox/CheckboxN2O';
import RadioN2O from '../../controls/Radio/RadioN2O';
import AdvancedTableCell from './AdvancedTableCell';
import AdvancedTableHeaderRow from './AdvancedTableHeaderRow';
import AdvancedTableSelectionColumn from './AdvancedTableSelectionColumn';
import withAdvancedTableRef from './withAdvancedTableRef';

export const getIndex = (data, selectedId) => {
  const index = findIndex(data, model => model.id == selectedId);
  return index >= 0 ? index : 0;
};

const KEY_CODES = {
  DOWN: 'down',
  UP: 'up',
  SPACE: 'space',
};

const rowSelectionType = {
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
};

/**
 * Компонент Таблица
 * @reactProps {boolean} hasFocus - флаг наличия фокуса
 * @reactProps {string} className - класс таблицы
 * @reactProps {Array.<Object>} columns - настройки колонок
 * @reactProps {Array.<Object>} data - данные
 * @reactProps {Object} components - компоненты обертки
 * @reactProps {Node} emptyText - компонент пустых данных
 * @reactProps {object} hotKeys - настройка hot keys
 * @reactProps {any} expandedComponent - кастомный компонент подстроки
 * @reactProps {string} children - флаг раскрыт ли список дочерних записей (приходит из props table.children, expand - открыт)
 */
class AdvancedTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusIndex: props.autoFocus
        ? props.data && props.data[props.selectedId]
          ? get(props.data[props.selectedId], 'id')
          : get(props.data[0], 'id')
        : props.hasFocus
        ? 0
        : 1,
      selectIndex: props.hasSelect
        ? getIndex(props.data, props.selectedId)
        : -1,
      data: props.data || [],
      expandedRowKeys: [],
      expandRowByClick: false,
      selection: {},
      selectAll: false,
      columns: [],
      checkedAll: false,
      checked: props.data ? this.mapChecked(props.data) : {},
      children: get(props, 'table.children', 'collapse'),
    };

    this.rows = {};
    this._dataStorage = [];

    this.components = {
      header: {
        row: AdvancedTableHeaderRow,
        cell: AdvancedTableHeaderCell,
        ...get(props.components, 'header', {}),
      },
      body: {
        row: this.renderTableRow(props),
        cell: AdvancedTableCell,
        ...get(props.components, 'body', {}),
      },
    };

    this.setRowRef = this.setRowRef.bind(this);
    this.getRowProps = this.getRowProps.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleExpandedRowsChange = this.handleExpandedRowsChange.bind(this);
    this.mapColumns = this.mapColumns.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.handleChangeChecked = this.handleChangeChecked.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.setSelectionRef = this.setSelectionRef.bind(this);
    this.getModelsFromData = this.getModelsFromData.bind(this);
    this.setTableRef = this.setTableRef.bind(this);
    this.openAllRows = this.openAllRows.bind(this);
    this.closeAllRows = this.closeAllRows.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
    this.renderExpandedRow = this.renderExpandedRow.bind(this);
    this.getScroll = this.getScroll.bind(this);
  }
  componentWillMount() {
    if (this.state.children === 'expand') {
      this.openAllRows();
    }
  }
  componentDidMount() {
    const { rowClick, columns } = this.props;
    const {
      isAnyTableFocused,
      isActive,
      focusIndex,
      selectIndex,
      data,
      autoFocus,
    } = this.state;
    if (!isAnyTableFocused && isActive && !rowClick && autoFocus) {
      this.setSelectAndFocus(
        get(data[selectIndex], 'id'),
        get(data[focusIndex], 'id')
      );
    }

    this.setState({
      columns: this.mapColumns(columns),
    });

    this._dataStorage = this.getModelsFromData(data);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      hasSelect,
      data,
      isAnyTableFocused,
      isActive,
      selectedId,
      autoFocus,
      columns,
      multi,
      rowSelection,
    } = this.props;
    const { checked } = this.state;

    if (hasSelect && !isEmpty(data) && !isEqual(data, prevProps.data)) {
      const id = selectedId || data[0].id;
      if (isAnyTableFocused && !isActive) {
        this.setNewSelectIndex(id);
      } else if (autoFocus) {
        this.setSelectAndFocus(id, id);
      }
    }
    if (!isEqual(prevProps, this.props)) {
      let state = {};
      if (isEqual(prevProps.filters, this.props.filters)) this.closeAllRows();
      if (data && !isEqual(prevProps.data, data)) {
        const checked = this.mapChecked(data, multi);
        state = {
          data: isArray(data) ? data : [data],
          checked,
        };
        this._dataStorage = this.getModelsFromData(data);
      }
      if (!isEqual(prevProps.columns, columns)) {
        state = {
          ...state,
          columns: this.mapColumns(columns),
        };
      }
      if (
        !isEqual(prevProps.selectedId, selectedId) &&
        rowSelection !== rowSelectionType.RADIO
      ) {
        this.setNewSelectIndex(selectedId);
      }
      this.setState({ ...state });
    }
    if (
      !isEqual(prevState.checked, checked) &&
      rowSelection === rowSelectionType.CHECKBOX
    ) {
      const selectAllCheckbox = ReactDom.findDOMNode(
        this.selectAllCheckbox
      ).querySelector('input');

      let all = false;

      const isSomeOneChecked = some(checked, i => i);
      const isAllChecked = every(checked, i => i);
      if (isAllChecked) {
        all = true;
      }
      selectAllCheckbox.indeterminate = isSomeOneChecked && !isAllChecked;
      selectAllCheckbox.checked = isAllChecked;

      this.setState({ checkedAll: all });
    }
  }

  renderTableRow(props) {
    const { rows } = props;
    return props => {
      if (isEmpty(rows)) {
        return get(props, 'rowClick', false) ? (
          <AdvancedTableRowWithAction {...props} />
        ) : (
          <AdvancedTableRow {...props} />
        );
      } else
        return (
          <SecurityCheck
            config={rows.security}
            render={({ permissions }) => {
              return permissions ? (
                <AdvancedTableRowWithAction {...props} />
              ) : (
                <AdvancedTableRow {...props} />
              );
            }}
          />
        );
    };
  }

  mapChecked(data, multi) {
    const checked = {};
    map(data, item => {
      checked[item.id] = (multi && multi[item.id]) || false;
    });
    return checked;
  }

  getModelsFromData(data) {
    let dataStorage = [];
    const getChildren = children => {
      return map(children, model => {
        let array = [...children];
        if (model.children) {
          array = [...array, getChildren(model.children)];
        }
        return array;
      });
    };

    map(data, item => {
      if (item.children) {
        const children = getChildren(item.children);
        dataStorage.push(...flattenDeep(children));
      }
      dataStorage.push(item);
    });

    return dataStorage;
  }

  setTableRef(el) {
    this.table = el;
  }

  setSelectionRef(el) {
    this.selectAllCheckbox = el;
  }

  setRowRef(ref, id) {
    if (ref && ref !== this.rows[id]) {
      this.rows[id] = ref;
    }
  }

  handleKeyDown(e, keyName) {
    const { data, children, hasFocus, hasSelect, autoFocus } = this.props;
    const { focusIndex } = this.state;

    const modelIndex = findIndex(data, i => i.id === focusIndex);

    if (eq(keyName, KEY_CODES.UP) || eq(keyName, KEY_CODES.DOWN)) {
      if (!React.Children.count(children) && hasFocus) {
        const newFocusIndex = eq(keyName, KEY_CODES.UP)
          ? modelIndex - 1
          : modelIndex + 1;

        if (newFocusIndex >= data.length || newFocusIndex < 0) return false;
        const nextData = data[newFocusIndex];
        if (hasSelect && autoFocus) {
          this.setSelectAndFocus(nextData.id, nextData.id);
          this.props.onResolve(nextData);
        } else {
          this.setNewFocusIndex(nextData.id);
        }
      }
    } else if (eq(keyName, KEY_CODES.SPACE)) {
      if (hasSelect && !autoFocus) {
        this.props.onResolve(data[modelIndex]);
        this.setNewSelectIndex(focusIndex);
      }
    }
  }

  handleFilter(filter) {
    const { onFilter } = this.props;
    onFilter && onFilter(filter);
  }

  handleRowClick(id, index, needReturn, noResolve) {
    const {
      hasFocus,
      hasSelect,
      onResolve,
      isActive,
      rowSelection,
    } = this.props;

    const needToReturn = isActive === needReturn;

    if (!needToReturn && hasSelect && !noResolve) {
      onResolve(find(this._dataStorage, { id }));
    }

    if (needToReturn) return;

    if (rowSelection === rowSelectionType.RADIO)
      this.handleChangeRadioChecked(index);

    if (!noResolve && hasSelect && hasFocus) {
      this.setSelectAndFocus(id, id);
    } else if (hasFocus) {
      this.setNewFocusIndex(id);
    } else if (hasSelect) {
      this.setNewSelectIndex(id);
    }
  }

  handleRowClickWithAction(id, index, needReturn, noResolve, model) {
    const {
      hasFocus,
      hasSelect,
      rowClick,
      onRowClickAction,
      onResolve,
      isActive,
      autoCheckboxOnSelect,
      rowSelection,
    } = this.props;
    const needToReturn = isActive === needReturn;

    if (!needToReturn && hasSelect && !noResolve) {
      onResolve(find(this._dataStorage, { id }));
    }

    if (
      !noResolve &&
      rowClick &&
      !(autoCheckboxOnSelect && rowSelection === rowSelectionType.CHECKBOX)
    ) {
      !hasSelect && onResolve(find(this._dataStorage, { id }));
      onRowClickAction(model);
    }

    if (rowSelection === rowSelectionType.RADIO)
      this.handleChangeRadioChecked(index);

    if (needToReturn) return;

    if (!noResolve && hasSelect && hasFocus && !rowClick) {
      this.setSelectAndFocus(id, id);
    } else if (hasFocus) {
      this.setNewFocusIndex(id);
    } else if (hasSelect && !rowClick) {
      this.setNewSelectIndex(id);
    }
  }

  setNewFocusIndex(index) {
    this.setState({ focusIndex: index }, () => this.focusActiveRow());
  }

  setNewSelectIndex(index) {
    this.setState({ selectIndex: index });
  }

  setSelectAndFocus(selectIndex, focusIndex) {
    this.setState({ selectIndex, focusIndex }, () => {
      this.focusActiveRow();
    });
  }

  focusActiveRow() {
    this.rows[this.state.focusIndex] &&
      this.rows[this.state.focusIndex].focus();
  }

  openAllRows() {
    const { data } = this.props;
    const keys = [];
    const getKeys = array => {
      return map(array, item => {
        keys.push(item.id);
        if (item.children) {
          getKeys(item.children);
        }
      });
    };
    getKeys(data);
    this.setState({
      expandedRowKeys: keys,
    });
  }

  closeAllRows() {
    this.setState({
      expandedRowKeys: [],
    });
  }

  handleExpandedRowsChange(rows) {
    this.setState({
      expandedRowKeys: rows,
    });
  }

  checkAll(status) {
    const { onSetSelection, multi, data } = this.props;
    const { checked } = this.state;
    const newChecked = {};
    let newMulti = multi || [];
    if (!status) {
      forOwn(data, v => delete newMulti[v.id]);
    } else {
      forOwn(data, v => {
        newMulti = { ...newMulti, ...{ [v.id]: v } };
      });
    }
    onSetSelection(newMulti);
    forOwn(Object.keys(checked), value => {
      newChecked[value] = status;
    });
    this.setState(() => ({
      checkedAll: !status,
      checked: newChecked,
    }));
  }

  handleChangeChecked(index) {
    const { onSetSelection, data, multi } = this.props;
    const { checked } = this.state;
    let newMulti = multi || [];
    let checkedState = {
      ...checked,
    };
    if (newMulti[index]) {
      delete newMulti[index];
      checkedState[index] = false;
    } else {
      checkedState = {
        ...checked,
        [index]: !checked[index],
      };
      let item = null;
      forOwn(checkedState, (v, k) => {
        if (v) {
          item =
            find(data, i => get(i, 'id').toString() === k.toString()) || {};
          const itemId = get(item, 'id');
          if (itemId) newMulti = { ...newMulti, ...{ [itemId]: item } };
        }
      });
    }
    onSetSelection(newMulti);
    this.setState(() => ({
      checked: checkedState,
    }));
  }

  handleChangeRadioChecked(index) {
    const { rowSelection, onSetSelection, data } = this.props;
    if (rowSelection !== rowSelectionType.RADIO) return;
    const checkedState = {
      [index]: true,
    };
    const id = findIndex(data, i => get(i, 'id') === index);
    const newMulti = {
      [index]: data[id],
    };
    onSetSelection(newMulti);
    this.setState(() => ({
      checked: checkedState,
    }));
  }

  handleResize(index) {
    return (e, { size }) => {
      this.setState(({ columns }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        return { columns: nextColumns };
      });
    };
  }

  handleEdit(value, index, id) {
    const { onEdit } = this.props;
    let data = this.state.data;
    data[index][id] = value;
    this.setState({
      data,
    });
    onEdit(value, index, id);
  }

  getRowProps(model, index) {
    const {
      rowClick,
      rowClass,
      rowSelection,
      autoCheckboxOnSelect,
    } = this.props;
    return {
      index,
      rowClick,
      isRowActive: model.id === this.state.selectIndex,
      rowClass: rowClass && propsResolver(rowClass, model),
      model,
      setRef: this.setRowRef,
      handleRowClick: () => {
        this.handleRowClick(model.id, model.id, false);
        if (autoCheckboxOnSelect && rowSelection === rowSelectionType.CHECKBOX)
          this.handleChangeChecked(model.id);
      },
      handleRowClickFocus: () =>
        this.handleRowClick(model.id, model.id, true, true),
      clickWithAction: () =>
        this.handleRowClickWithAction(model.id, model.id, false, false, model),
      clickFocusWithAction: () =>
        this.handleRowClickWithAction(model.id, model.id, true, true, model),
    };
  }

  createSelectionColumn(columns, rowSelection) {
    const isSomeFixed = some(columns, c => c.fixed);
    return {
      title:
        rowSelection === rowSelectionType.CHECKBOX ? (
          <AdvancedTableSelectionColumn
            setRef={this.setSelectionRef}
            onChange={this.checkAll}
          />
        ) : null,
      dataIndex: 'row-selection',
      key: 'row-selection',
      className: 'n2o-advanced-table-selection-container',
      width: 30,
      fixed: isSomeFixed && 'left',
      render: (value, model) =>
        rowSelection === rowSelectionType.CHECKBOX ? (
          <CheckboxN2O
            className="n2o-advanced-table-row-checkbox"
            inline={true}
            checked={this.state.checked[model.id]}
            onChange={() => this.handleChangeChecked(model.id)}
          />
        ) : rowSelection === rowSelectionType.RADIO ? (
          <RadioN2O
            className="n2o-advanced-table-row-radio"
            inline={true}
            checked={this.state.checked[model.id]}
            onChange={() => this.handleChangeRadioChecked(model.id)}
          />
        ) : null,
    };
  }

  getRowKey(row) {
    return row.key;
  }

  renderIcon({ record, expanded, onExpand }) {
    const { expandedFieldId, expandedComponent } = this.props;

    return (
      <AdvancedTableExpandIcon
        record={record}
        expanded={expanded}
        onExpand={onExpand}
        expandedFieldId={expandedFieldId}
        expandedComponent={expandedComponent}
      />
    );
  }

  renderExpandedRow() {
    const { expandable, expandedComponent, expandedFieldId } = this.props;

    return (
      expandable &&
      (expandedComponent
        ? (record, index, indent) =>
            React.createElement(expandedComponent, {
              record,
              index,
              indent,
              expandedFieldId,
            })
        : (record, index, indent) => (
            <AdvancedTableExpandedRenderer
              record={record}
              index={index}
              indent={indent}
              expandedFieldId={expandedFieldId}
            />
          ))
    );
  }

  mapColumns(columns = []) {
    const { rowSelection, filters } = this.props;
    let newColumns = columns;
    newColumns = map(newColumns, (col, columnIndex) => ({
      ...col,
      onHeaderCell: column => ({
        ...column,
        onFilter: this.handleFilter,
        onResize: this.handleResize(columnIndex),
        filters,
      }),
      onCell: record => ({
        record,
        editable: col.editable && record.editable,
        hasSpan: col.hasSpan,
      }),
    }));
    if (!!rowSelection) {
      newColumns = [
        this.createSelectionColumn(columns, rowSelection),
        ...newColumns,
      ];
    }
    return newColumns;
  }

  getScroll() {
    if (isEmpty(this.props.data) || isEmpty(this.props.columns)) {
      return this.props.scroll;
    }

    if (some(this.state.columns, col => col.fixed)) return this.props.scroll;
    const { scroll, columns } = this.props;

    const calcXScroll = () => {
      const getWidth = (
        separator,
        startValue,
        defaultWidth,
        tryParse = false
      ) =>
        reduce(
          columns,
          (result, value) => {
            if (value.width) {
              return includes(value.width, separator) ||
                (tryParse && isNumber(value.width))
                ? result + parseInt(value.width)
                : result;
            } else {
              return result + defaultWidth;
            }
          },
          startValue
        );

      const pxWidth = getWidth('px', 5, 100, true);
      const percentWidth = getWidth('%', 0, 0);

      return percentWidth !== 0
        ? `calc(${percentWidth}%${pxWidth > 5 ? ` + ${pxWidth}px` : ''})`
        : pxWidth;
    };

    return {
      ...scroll,
      x: calcXScroll(),
    };
  }

  render() {
    const {
      hasFocus,
      className,
      expandable,
      onExpand,
      tableSize,
      useFixedHeader,
      bordered,
      isActive,
      onFocus,
      rowSelection,
    } = this.props;

    return (
      <HotKeys
        keyMap={{ events: values(KEY_CODES) }}
        handlers={{ events: this.handleKeyDown }}
      >
        <div onFocus={!isActive ? onFocus : undefined}>
          <Table
            ref={this.setTableRef}
            prefixCls={'n2o-advanced-table'}
            className={cx('n2o-table table table-hover', className, {
              'has-focus': hasFocus,
              [`table-${tableSize}`]: tableSize,
              'table-bordered': bordered,
            })}
            columns={this.state.columns}
            data={this.state.data}
            onRow={this.getRowProps}
            components={this.components}
            rowKey={this.getRowKey}
            expandIcon={this.renderIcon}
            expandIconAsCell={!!rowSelection && expandable}
            expandedRowRender={this.renderExpandedRow()}
            expandedRowKeys={this.state.expandedRowKeys}
            onExpandedRowsChange={this.handleExpandedRowsChange}
            onExpand={onExpand}
            useFixedHeader={useFixedHeader}
            indentSize={20}
            emptyText={AdvancedTableEmptyText}
            scroll={this.getScroll()}
          />
        </div>
      </HotKeys>
    );
  }
}

AdvancedTable.propTypes = {
  /**
   * Наличие фокуса на строке при клике
   */
  hasFocus: PropTypes.bool,
  /**
   * Класс
   */
  className: PropTypes.string,
  /**
   * Массив колонок
   */
  columns: PropTypes.arrayOf(PropTypes.object),
  /**
   * Данные
   */
  data: PropTypes.arrayOf(PropTypes.object),
  /**
   * Кастомные компоненты
   */
  components: PropTypes.object,
  /**
   * Флаг включения border у таблицы
   */
  bordered: PropTypes.bool,
  /**
   * Тип выбора строк
   */
  rowSelection: PropTypes.string,
  /**
   * Флаг включения саб контента
   */
  expandable: PropTypes.bool,
  /**
   * Ключ к саб контенту в данных
   */
  expandedFieldId: PropTypes.string,
  /**
   * Кастомный компонент саб строки
   */
  expandedComponent: PropTypes.any,
  /**
   * Автофокус на строке
   */
  autoFocus: PropTypes.bool,
  /**
   * Конфиг для SecurityCheck
   */
  rows: PropTypes.object,
};

AdvancedTable.defaultProps = {
  expandedFieldId: 'expandedContent',
  data: [],
  bordered: false,
  tableSize: 'sm',
  rowSelection: '',
  expandable: false,
  onFocus: () => {},
  onSetSelection: () => {},
  autoFocus: false,
  rows: {},
};

export { AdvancedTable };
export default compose(
  setDisplayName('AdvancedTable'),
  pure,
  withAdvancedTableRef
)(AdvancedTable);
