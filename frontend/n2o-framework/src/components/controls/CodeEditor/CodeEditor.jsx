import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import cx from 'classnames';

import 'brace/mode/java';
import 'brace/mode/groovy';
import 'brace/mode/html';
import 'brace/mode/sql';
import 'brace/mode/javascript';
import 'brace/mode/xml';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';

/**
 * Компонент код-эдитор
 * @reactProps {string} value - начальное значение текста внутри эдитора
 * @reactProps {boolean} visible - отображается / не отображается
 * @reactProps {function} onChange - вызывается при изменении значеня поля
 * @reactProps {boolean} disabled - задизейблен / нет
 * @reactProps {string} name - имя поля
 * @reactProps {number} maxLines - максимальное количество линий
 * @reactProps {string} lang - язык программирования. Варианты: 'javascript', 'xml', 'sql', 'groovy', 'java', 'html'
 * @reactProps {boolean} autocomplete
 * @reactProps {boolean} visible - флаг видимости
 *
 */

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  onChange(value) {
    this.setState({ value });
    this.props.onChange(value);
  }

  componentWillReceiveProps(props) {
    if (props.value && props.value !== this.state.value) {
      this.setState({ value: props.value });
    }
  }

  /**
   * Базовый рендер
   */
  render() {
    const {
      disabled,
      name,
      visible,
      lang,
      minLines,
      maxLines,
      autocomplete,
      className,
    } = this.props;
    return (
      visible && (
        <div
          className={cx('n2o-code-editor', className)}
          style={{ display: 'flex', border: '1px solid #d1d1d1' }}
        >
          <AceEditor
            mode={lang}
            theme="tomorrow"
            name={name}
            onChange={this.onChange.bind(this)}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            readOnly={disabled}
            minLines={minLines}
            maxLines={maxLines}
            highlightActiveLine={true}
            value={this.state.value}
            enableBasicAutocompletion={autocomplete}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>
      )
    );
  }
}

CodeEditor.propTypes = {
  /**
   * Значение контрола
   */
  value: PropTypes.string,
  /**
   * Callback изменения
   */
  onChange: PropTypes.func,
  /**
   * Флаг активности
   */
  disabled: PropTypes.bool,
  /**
   * Название контрола
   */
  name: PropTypes.string,
  /**
   * Минимальное количество строк
   */
  minLines: PropTypes.number,
  /**
   * Максимальное количество строк
   */
  maxLines: PropTypes.number,
  /**
   * Пресет контрола
   */
  lang: PropTypes.oneOf(['javascript', 'xml', 'sql', 'groovy', 'java', 'html']),
  /**
   * Флаг включения автозаполнения
   */
  autocomplete: PropTypes.bool,
  /**
   * Флаг видимости
   */
  visible: PropTypes.bool,
};

CodeEditor.defaultProps = {
  autocomplete: false,
  lang: 'javascript',
  onChange: () => {},
  disabled: false,
  visible: true,
};

export default CodeEditor;
