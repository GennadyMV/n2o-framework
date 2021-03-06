import React from 'react';
import PropTypes from 'prop-types';
import isNull from 'lodash/isNull';
import moment from 'moment';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';

import Day from './Day';
import CalendarHeader from './CalendarHeader';
import {
  weeks,
  isDateFromPrevMonth,
  isDateFromNextMonth,
  addTime,
  hasInsideMixMax,
} from './utils';
import { ControlType } from './DateTimeControl';

/**
 * @reactProps {date} value
 * @reactProps {boolean} auto
 * @reactProps {function} select
 * @reactProps {boolean} hasDefaultTime
 * @reactProps {function} setPlacement
 * @reactProps {function} setVisibility
 * @reactProps {string} placement
 * @reactProps {moment} max
 * @reactProps {moment} min
 * @reactProps {string} locale
 * @reactProps {object} time
 * @reactProps {number} time.mins
 * @reactProps {number} time.hours
 */
class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayesMonth: props.value
        ? props.value.clone().startOf('month')
        : moment().startOf('month'),
      calendarType: Calendar.BY_DAYS,
      tempTimeObj: props.value ? this.objFromTime(props.value) : props.time,
    };
    this.nextMonth = this.nextMonth.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.nextYear = this.nextYear.bind(this);
    this.prevYear = this.prevYear.bind(this);
    this.prevDecade = this.prevDecade.bind(this);
    this.nextDecade = this.nextDecade.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setValue = this.setValue.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.setTimeUnit = this.setTimeUnit.bind(this);
    this.setTime = this.setTime.bind(this);
    this.changeCalendarType = this.changeCalendarType.bind(this);
    this.setHourRef = this.setHourRef.bind(this);
    this.setMinuteRef = this.setMinuteRef.bind(this);
    this.setSecondRef = this.setSecondRef.bind(this);
  }

  changeCalendarType(type) {
    this.setState({ calendarType: type });
  }

  componentWillReceiveProps(props) {
    if (props.value) {
      this.setState({
        displayesMonth: props.value
          ? props.value.clone().startOf('month')
          : moment().startOf('month'),
        tempTimeObj: props.value ? this.objFromTime(props.value) : props.time,
      });
    }
  }

  setHourRef(el) {
    this.hourRef = el;
  }

  setMinuteRef(el) {
    this.minuteRef = el;
  }

  setSecondRef(el) {
    this.secondRef = el;
  }

  /**
   * Рендер хэдера календаря
   */
  renderHeader() {
    const { displayesMonth, calendarType } = this.state;
    const { locale } = this.props;
    const {
      nextMonth,
      nextYear,
      prevMonth,
      prevYear,
      setValue,
      nextDecade,
      prevDecade,
      changeCalendarType,
    } = this;
    return (
      <CalendarHeader
        nextMonth={nextMonth}
        nextYear={nextYear}
        prevMonth={prevMonth}
        prevYear={prevYear}
        nextDecade={nextDecade}
        prevDecade={prevDecade}
        displayesMonth={displayesMonth}
        setValue={setValue}
        locale={locale}
        calendarType={calendarType}
        changeCalendarType={changeCalendarType}
      />
    );
  }

  /**
   *  установка значения года или месяца (при выборе из списка)
   * @param val
   * @param attr
   */
  setValue(val, attr) {
    if (attr === 'months') {
      this.setState({
        displayesMonth: this.state.displayesMonth
          .clone()
          .add(-this.state.displayesMonth.month() + val, attr),
      });
    } else {
      this.setState({
        displayesMonth: this.state.displayesMonth
          .clone()
          .add(moment().year() - this.state.displayesMonth.year() + val, attr),
      });
    }
  }

  /**
   * Сдвиг даты на месяц назад
   */
  prevMonth() {
    const displayesMonth = this.state.displayesMonth.subtract(1, 'months');
    this.setState({ displayesMonth });
  }

  /**
   * Сдвиг даты на месяц вперед
   */
  nextMonth() {
    const displayesMonth = this.state.displayesMonth.add(1, 'months');
    this.setState({ displayesMonth });
  }

  /**
   * Сдвиг даты на месяц вперед
   */
  prevYear() {
    const displayesMonth = this.state.displayesMonth.subtract(1, 'years');
    this.setState({ displayesMonth });
  }

  /**
   * Сдвиг даты на год вперед
   */
  nextYear() {
    const displayesMonth = this.state.displayesMonth.add(1, 'years');
    this.setState({ displayesMonth });
  }

  nextDecade() {
    const displayesMonth = this.state.displayesMonth.add(10, 'years');
    this.setState({ displayesMonth });
  }

  prevDecade() {
    const displayesMonth = this.state.displayesMonth.subtract(10, 'years');
    this.setState({ displayesMonth });
  }

  setDate(...args) {
    const displayesMonth = this.state.displayesMonth.set(...args);
    this.setState({ displayesMonth });
  }

  /**
   * Рендер назавний дней недели
   */
  renderNameOfDays() {
    const nameOfDays =
      this.props.locale === 'ru'
        ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
        : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return (
      <tr>
        {nameOfDays.map((day, i) => (
          <td key={i}>{day}</td>
        ))}
      </tr>
    );
  }

  /**
   * Рендер данного месяца по неделям
   */
  renderWeeks() {
    const displayesMonth = this.state.displayesMonth;
    const { hours, mins, seconds } = this.state.tempTimeObj;
    const firstDay = addTime(
      displayesMonth.clone().startOf('isoWeek'),
      hours,
      mins,
      seconds
    );
    return weeks(firstDay).map((week, i) => this.renderWeek(week, i));
  }

  /**
   * Рендер недели
   */
  renderWeek(week, i) {
    return <tr key={i}>{week.map((day, i) => this.renderDay(day, i))}</tr>;
  }

  /**
   * Рендер дня
   */
  renderDay(day, i) {
    const {
      min,
      max,
      value,
      select,
      inputName,
      type,
      index,
      values,
      dateFormat,
    } = this.props;

    let disabled = false;

    if (min && max) {
      disabled = day.isBefore(min) || day.isAfter(max);
    } else if (min) {
      disabled = day.isBefore(min);
    } else if (max) {
      disabled = day.isAfter(max);
    }

    if (type === ControlType.DATE_INTERVAL) {
      const { begin } = values;

      // откючить дни до (range)
      const disableDaysBefore = range => day.isBefore(range);
      // отключить дни после (range)
      const disableDaysAfter = range => day.isAfter(range);

      // откючить дни выходящие за рамки range (min or max)
      const disabledDaysBeyondTheScopeMinMax =
        disableDaysBefore(min) || disableDaysAfter(max);
      // откючить дни выходящие за рамки range (begin(дата в календаре index[1]) or max)
      const disabledDaysBeyondTheScopeBeginMax =
        disableDaysBefore(begin) || disableDaysAfter(max);

      //default range (min or max)
      const rangeMinMax = disabledDays =>
        (disabledDays = disabledDaysBeyondTheScopeMinMax);

      //если не выбрана дата(begin) ||  min or max
      const hasMinOrMaxAndNullBegin =
        (isNull(begin) && (min || max)) || (isNull(begin) && (min && max));

      //если hasMinOrMaxAndNullBegin, устанавливаем default range (min or max)
      if (hasMinOrMaxAndNullBegin) {
        rangeMinMax(disabled);
      } else if (min && max) {
        disabled =
          index === 0
            ? disabledDaysBeyondTheScopeMinMax
            : disabledDaysBeyondTheScopeBeginMax;
      } else if (min) {
        disabled =
          index === 0
            ? disableDaysBefore(min)
            : index === 1 && disableDaysBefore(begin);
      } else if (max) {
        disabled =
          index === 0
            ? disableDaysAfter(max)
            : index === 1 && disableDaysAfter(begin);
      } else {
        //не указан range (min, max)
        disabled = index === 1 && disableDaysBefore(begin);
      }
    }

    const displayesMonth = this.state.displayesMonth.clone();
    const otherMonth =
      isDateFromNextMonth(day, displayesMonth) ||
      isDateFromPrevMonth(day, displayesMonth);
    const selected = day.isSame(value);
    const current = day.format('DD.MM.YYYY') === moment().format('DD.MM.YYYY');
    const props = {
      day,
      otherMonth,
      selected,
      disabled,
      select,
      inputName,
      current,
      dateFormat,
    };
    return <Day key={i} {...props} />;
  }

  /**
   * Навигация по кнопкам, вверх/вниз - смена года, вправо/влево - смена месяца
   */
  onKeyDown(e) {
    const { calendarType } = this.state;
    const evtobj = window.event ? window.event : e;
    const leftKeyCode = 37;
    const rightKeyCode = 39;
    if (evtobj.ctrlKey) {
      switch (evtobj.keyCode) {
        case leftKeyCode:
          if (calendarType === Calendar.BY_DAYS) {
            this.prevMonth();
          } else if (calendarType === Calendar.BY_MONTHS) {
            this.prevYear();
          } else if (calendarType === Calendar.BY_YEARS) {
            this.prevDecade();
          }
          break;
        case rightKeyCode:
          if (calendarType === Calendar.BY_DAYS) {
            this.nextMonth();
          } else if (calendarType === Calendar.BY_MONTHS) {
            this.nextYear();
          } else if (calendarType === Calendar.BY_YEARS) {
            this.nextDecade();
          }
          break;
      }
    }
  }

  /**
   * Навешивание листенера на нажатие кнопок
   */
  componentWillMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  /**
   * Удаление листенера при анмаунте компонента
   */
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  renderTime() {
    const { value, hasDefaultTime, timeFormat } = this.props;

    return hasDefaultTime ? (
      value ? (
        value.format(timeFormat)
      ) : (
        '00:00:00'
      )
    ) : (
      <FormattedMessage
        id="Datepicker.time-choose"
        defaultMessage="Выберите время"
      />
    );
  }

  objFromTime(date) {
    return {
      mins: date.minutes(),
      seconds: date.seconds(),
      hours: date.hours(),
    };
  }

  timeFromObj(timeObj) {
    const { hours, mins, seconds } = timeObj;
    return moment(`${hours}:${mins}:${seconds}`, 'H:m:s').format(
      this.props.timeFormat || 'H:mm:ss'
    );
  }

  renderByDays() {
    return (
      <React.Fragment>
        <table className="n2o-calendar-table">
          <thead>{this.renderNameOfDays()}</thead>
          <tbody>{this.renderWeeks()}</tbody>
        </table>
        {this.props.timeFormat && (
          <a
            className="n2o-calendar-time-container"
            href="/test"
            onClick={e => {
              e.preventDefault();
              this.changeCalendarType(Calendar.TIME_PICKER);
            }}
          >
            {this.renderTime()}
          </a>
        )}
      </React.Fragment>
    );
  }

  renderByMonths() {
    const { displayesMonth } = this.state;
    const { locale } = this.props;
    const year = displayesMonth.format('YYYY');
    return (
      <div className="n2o-calendar-body">
        {this.renderList(moment.localeData(locale).months(), 'month-item')}
      </div>
    );
  }

  onItemClick(itemType, item, i) {
    if (itemType === 'month-item') {
      this.setDate('month', i);
    } else {
      this.setDate('year', item);
    }
    this.changeCalendarType(Calendar.BY_DAYS);
  }

  renderList(list, className) {
    const { value } = this.props;

    const isActive = (className, item, i) => {
      if (!value) return false;
      if (className !== 'month-item') {
        return item === value.year();
      }
      return i === value.month();
    };
    const isOtherDecade = i =>
      className === 'year-item' && (i === 0 || i === 11);
    return list.map((item, i) => {
      return (
        <div
          className={cx('n2o-calendar-body-item', className, {
            active: isActive(className, item, i),
            'other-decade': isOtherDecade(i),
          })}
          onClick={() => this.onItemClick(className, item, i)}
        >
          {item}
        </div>
      );
    });
  }

  renderByYears() {
    const { displayesMonth } = this.state;
    const { locale } = this.props;
    const decadeStart = parseInt(+displayesMonth.format('YYYY') / 10) * 10;
    const years = Array.from(
      new Array(12),
      (val, index) => decadeStart + index - 1
    );
    return (
      <div className="n2o-calendar-body">
        {this.renderList(years, 'year-item')}
      </div>
    );
  }

  componentDidUpdate() {
    if (this.state.calendarType === Calendar.TIME_PICKER) {
      this.minuteRef && this.minuteRef.scrollIntoView();
      this.secondRef && this.secondRef.scrollIntoView();
      this.hourRef && this.hourRef.scrollIntoView();
    }
  }

  setTimeUnit(value, unit) {
    this.setState({
      tempTimeObj: { ...this.state.tempTimeObj, [unit]: value },
    });
  }

  setTime() {
    const { value, inputName, markTimeAsSet, select } = this.props;
    const { hours, mins, seconds } = this.state.tempTimeObj;
    const copyValue = value || moment();
    this.changeCalendarType(Calendar.BY_DAYS);
    markTimeAsSet(inputName);

    select(
      addTime(copyValue.clone().startOf('day'), hours, mins, seconds),
      inputName,
      false
    );
  }

  renderTimePicker() {
    const { mins, seconds, hours } = this.state.tempTimeObj;
    return (
      <div>
        <div className="n2o-calendar-timepicker">
          <div className="n2o-calendar-picker hour-picker">
            {Array.from(new Array(24), (val, index) => (
              <div
                className={cx('n2o-calendar-time-unit', {
                  active: index === hours,
                })}
                onClick={() => this.setTimeUnit(index, 'hours')}
                ref={index === hours ? this.setHourRef : null}
              >
                {index}
              </div>
            ))}
          </div>
          <div className="n2o-calendar-picker minute-picker">
            {Array.from(new Array(60), (val, index) => (
              <div
                className={cx('n2o-calendar-time-unit', {
                  active: index === mins,
                })}
                ref={index === mins ? this.setMinuteRef : null}
                onClick={() => this.setTimeUnit(index, 'mins')}
              >
                {index}
              </div>
            ))}
          </div>
          <div className="n2o-calendar-picker second-picker">
            {Array.from(new Array(60), (val, index) => (
              <div
                className={cx('n2o-calendar-time-unit', {
                  active: index === seconds,
                })}
                ref={index === seconds ? this.setSecondRef : null}
                onClick={() => this.setTimeUnit(index, 'seconds')}
              >
                {index}
              </div>
            ))}
          </div>
        </div>
        <div className="n2o-calendar-time-buttons">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => this.changeCalendarType(Calendar.BY_DAYS)}
          >
            {' '}
            Назад
          </button>
          <button className="btn btn-primary btn-sm" onClick={this.setTime}>
            {' '}
            Выбрать
          </button>
        </div>
      </div>
    );
  }

  renderBody(type) {
    let body = null;
    switch (type) {
      case Calendar.BY_MONTHS:
        body = this.renderByMonths();
        break;
      case Calendar.BY_YEARS:
        body = this.renderByYears();
        break;
      case Calendar.TIME_PICKER:
        body = this.renderTimePicker();
        break;
      case Calendar.BY_DAYS:
      default:
        body = this.renderByDays();
    }
    return body;
  }

  render() {
    const { calendarType } = this.state;
    const {
      inputValue,
      inputOnClick,
      inputClassName,
      format,
      calRef,
    } = this.props;
    return (
      <div
        className={cx('n2o-calendar', 'calenadar', {
          time: this.props.timeFormat,
        })}
        tabIndex="0"
      >
        {this.renderHeader(calendarType)}
        {this.renderBody(calendarType)}
      </div>
    );
  }
}

Calendar.BY_DAYS = 'by_days';
Calendar.BY_MONTHS = 'by_months';
Calendar.BY_YEARS = 'by_years';
Calendar.TIME_PICKER = 'time_picker';

Calendar.defaultProps = {
  time: {
    mins: 0,
    hours: 0,
  },
  placement: 'bottom',
  locale: 'ru',
  clock: true,
};

Calendar.propTypes = {
  value: PropTypes.instanceOf(moment).isRequired,
  auto: PropTypes.bool,
  select: PropTypes.func,
  hasDefaultTime: PropTypes.bool,
  setPlacement: PropTypes.func,
  setVisibility: PropTypes.func,
  placement: PropTypes.string,
  max: PropTypes.instanceOf(moment),
  min: PropTypes.instanceOf(moment),
  locale: PropTypes.oneOf(['en', 'ru']),
  time: PropTypes.shape({
    mins: PropTypes.number,
    hours: PropTypes.number,
  }),
};

export default Calendar;
