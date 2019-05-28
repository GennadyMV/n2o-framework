import React, { Fragment, Component } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { isInteger, eq, round } from 'lodash';
import { id } from '../../../utils/id';

import { mapToNum } from './utils';

class Rating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: Math.ceil(props.rating),
    };
    this.id = id();
    this.onChangeAndSetState = this.onChangeAndSetState.bind(this);
    this.renderStars = this.renderStars.bind(this);
    this.renderNullStar = this.renderNullStar.bind(this);
    this.renderTooltip = this.renderTooltip.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value && nextProps.value) {
      console.log({ value: nextProps.value });
      return {
        value: nextProps.value,
      };
    }
  }

  onChangeAndSetState({ target: { value } }) {
    const newValue = Number(value);
    const { onChange } = this.props;
    this.setState({ value: newValue });
    onChange(newValue);
  }

  renderTooltip() {
    const { rating, showTooltip } = this.props;
    return showTooltip ? (
      <UncontrolledTooltip placement="top" target={this.id}>
        {round(rating, 2)}
      </UncontrolledTooltip>
    ) : null;
  }

  renderNullStar() {
    const { value } = this.state;
    return (
      <Fragment>
        <input
          className="rating__input rating__input--none"
          name="rating2"
          id={`rating-0-${this.id}`}
          value="0"
          type="radio"
          onClick={this.onChangeAndSetState}
          checked={eq(0, value)}
        />
        <label className="rating__label" htmlFor={`rating-0-${this.id}`}>
          &nbsp;
        </label>
      </Fragment>
    );
  }

  renderStars(index) {
    const { value } = this.state;
    return (
      <Fragment>
        <label
          className={cx('rating__label', {
            'rating__label--half': !isInteger(index),
          })}
          htmlFor={`rating-${index}-${this.id}`}
        >
          <i
            className={cx('rating__icon rating__icon--star fa', {
              'fa-star-half': !isInteger(index),
              'fa-star': isInteger(index),
            })}
          />
        </label>
        <input
          className="rating__input"
          name={`rating-${index}-${this.id}`}
          id={`rating-${index}-${this.id}`}
          value={index}
          type="radio"
          onClick={this.onChangeAndSetState}
          checked={eq(index, value)}
        />
      </Fragment>
    );
  }

  render() {
    const { max, half } = this.props;

    const options = {
      increment: half ? 0.5 : 1,
      start: half ? 0.5 : 1,
      inclusive: true,
    };

    return (
      <div className="n2o-rating-stars">
        <div className="rating-group" id={this.id}>
          {this.renderNullStar()}
          {mapToNum(max, this.renderStars, options)}
        </div>
        {this.renderTooltip()}
      </div>
    );
  }
}

Rating.propTypes = {
  max: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
  rating: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
  half: PropTypes.bool,
  showTooltip: PropTypes.bool,
  onChange: PropTypes.func,
};

Rating.defaultProps = {
  max: 5,
  half: false,
  rating: 0,
  showTooltip: false,
  onChange: () => {},
};

export default Rating;
