'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./index.css');

var _ic_back = require('./ic_back.svg');

var _ic_back2 = _interopRequireDefault(_ic_back);

var _ic_forward = require('./ic_forward.svg');

var _ic_forward2 = _interopRequireDefault(_ic_forward);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var config = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  month_subs: ['Jan', 'Feb', 'Apr', 'Mar', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  weeks: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  week_subs: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
  today: function today() {
    return new Date();
  }
};

var TODAY = config.today();

var Calendar = function (_Component) {
  _inherits(Calendar, _Component);

  function Calendar(props) {
    _classCallCheck(this, Calendar);

    var _this = _possibleConstructorReturn(this, (Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call(this, props));

    _this.state = {
      current: config.today(),
      selected: config.today(),
      ldom: 30
    };
    return _this;
  }

  _createClass(Calendar, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.updateMonth(0);
    }
  }, {
    key: 'updateMonth',
    value: function updateMonth(add) {
      var d = this.state.current;
      d.setMonth(d.getMonth() + add);
      var eom = new Date(d.getYear(), d.getMonth() + 1, 0).getDate();
      this.setState({
        current: d,
        ldom: eom
      });
    }
  }, {
    key: 'prev',
    value: function prev() {
      this.updateMonth(-1);
    }
  }, {
    key: 'next',
    value: function next() {
      this.updateMonth(1);
    }
  }, {
    key: '_onDatePicked',
    value: function _onDatePicked(month, day) {
      var d = new Date(this.state.current.getTime());
      d.setMonth(d.getMonth() + month);
      d.setDate(day);
      this.props.onDatePicked(d);
      this.setState({
        selected: d
      });
    }
  }, {
    key: 'renderDay',
    value: function renderDay() {
      var _this2 = this;

      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var baseClasses = "calender-day calender-noselect calender-non-current";
      var today = "";
      var selectFlag = false;
      var todayStyle = {};
      var containerStyle = {};
      if (opts.today) {
        today = "current";
        todayStyle = {
          borderColor: this.props.accentColor
        };
      }

      var selected = "";
      var selectedStyle = {};
      if (opts.selected) {
        selected = "calender-selected";
        selectedStyle = {
          backgroundColor: this.props.accentColor
        };
        containerStyle = {
          color: '#3498DB'
        };
      }

      opts.selectedDayList;
      // write the month logic here. 
      if (opts.selectedDayList != "") {
        for (var index = 0; index < opts.selectedDayList.length; index++) {
          var cmpDate = new Date(opts.selectedDayList[index]);
          if (cmpDate.getDate() == opts.date.getDate() && cmpDate.getMonth() == opts.date.getMonth()) {
            baseClasses = "calender-day calender-noselect";
            selectFlag = true;
          }
        }
      }

      return _react2.default.createElement(
        'div',
        { className: baseClasses,
          style: containerStyle },
        _react2.default.createElement('div', { className: today, style: todayStyle }),
        _react2.default.createElement('div', { className: selected, style: selectedStyle }),
        _react2.default.createElement(
          'p',
          { onClick: function onClick(ev) {
              var day = ev.target.innerHTML;
              selectFlag ? _this2._onDatePicked(opts.month, day) : "";
            } },
          opts.date.getDate()
        )
      );
    }
  }, {
    key: 'renderDays',
    value: function renderDays(copy) {

      // if(this.props.selectedDays.length === 0) return null
      var days = [];
      var selectedDay = [];
      if (this.props.selectedDays != undefined || this.props.selectedDays != []) {
        for (var _i = 2; _i < this.props.selectedDays.length; _i++) {
          var dates = this.props.selectedDays[_i].date;
          if (dates.split("-")[2].length < 2) {
            selectedDay.push(new Date(dates.split("-")[0] + '-' + dates.split("-")[1] + '-0' + dates.split("-")[2]));
          } else {
            selectedDay.push(new Date(this.props.selectedDays[_i].date));
          }
        }
      }
      // set to beginning of month
      copy.setDate(1);

      // if we are missing no offset, include the previous week
      var offset = copy.getDay() === 0 ? 7 : copy.getDay();

      copy.setDate(-offset);

      var inMonth = false;
      var lastMonth = true;
      for (var i = 0; i < 42; i++) {
        // increase date
        copy.setDate(copy.getDate() + 1);

        // make sure we pass any previous month values
        if (i < 30 && copy.getDate() === 1) {
          inMonth = true;
          lastMonth = false;
        }
        // if we are seeing the '1' again, we have iterated over
        // the current month
        else if (i > 30 && copy.getDate() === 1) {
            inMonth = false;
          }

        var sel = new Date(this.state.selected.getTime());
        var isSelected = sel.getFullYear() === copy.getFullYear() && sel.getDate() === copy.getDate() && sel.getMonth() === copy.getMonth();

        var isToday = TODAY.getFullYear() === copy.getFullYear() && TODAY.getDate() === copy.getDate() && TODAY.getMonth() === copy.getMonth();

        // console.log("this is updated copy: ", copy);

        days.push(this.renderDay({
          today: isToday,
          selected: isSelected,
          selectedDayList: selectedDay || "",
          current: inMonth,
          month: inMonth ? 0 : lastMonth ? -1 : 1,
          date: copy
        }));
      }

      return days;
    }
  }, {
    key: 'renderHeaders',
    value: function renderHeaders() {
      var header = [];

      for (var i = 0; i < config.week_subs.length; i++) {
        header.push(_react2.default.createElement(
          'p',
          { className: 'calender-day-headers calender-noselect' },
          config.week_subs[i]
        ));
      }

      return header;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps != undefined) {
        if (nextProps.selectedDays[0] != undefined) {

          if (nextProps.selectedDays[0].date.split("-")[1].length < 2) {
            if (nextProps.selectedDays[0].date.split("-")[2].length < 2) {
              this.setState({ current: new Date(nextProps.selectedDays[0].date.split("-")[0] + '-0' + nextProps.selectedDays[0].date.split("-")[1] + '-0' + nextProps.selectedDays[0].date.split("-")[2]) });
            } else {
              this.setState({ current: new Date(nextProps.selectedDays[0].date.split("-")[0] + '-0' + nextProps.selectedDays[0].date.split("-")[1] + '-' + nextProps.selectedDays[0].date.split("-")[2]) });
            }
          } else {
            this.setState({ current: new Date(nextProps.selectedDays[0].date) });
          }
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      // get su-sat header
      var header = this.renderHeaders();

      // copy our current time state
      var copy = new Date(this.state.current.getTime());

      // get the month days
      var days = this.renderDays(copy);

      var tMonth = config.months[this.state.selected];
      var tDate = this.state.selected.getDate();
      var month = config.months[this.state.current.getMonth()];

      var year = this.state.current.getFullYear();
      var date = this.state.current.getDate();
      console.log("Just a log 2 : ", this.props.selectedDays);
      var upperDate = null;
      if (this.props.showHeader) {
        upperDate = _react2.default.createElement(
          'div',
          { className: 'flex-2 calender-header center', style: {
              backgroundColor: this.props.accentColor
            } },
          _react2.default.createElement(
            'p',
            { className: 'calender-header-month' },
            tMonth.toUpperCase()
          ),
          _react2.default.createElement(
            'p',
            { className: 'calender-header-day' },
            tDate
          )
        );
      }
      return _react2.default.createElement(
        'div',
        { className: this.props.orientation },
        upperDate,
        _react2.default.createElement(
          'div',
          { className: 'calender-padding' },
          _react2.default.createElement(
            'div',
            { className: 'calender-month' },
            _react2.default.createElement('img', { className: 'calender-month-arrow-left', src: _ic_back2.default, alt: 'back', onClick: this.prev.bind(this) }),
            _react2.default.createElement(
              'p',
              { className: 'calender-month-title' },
              month,
              _react2.default.createElement('br', null),
              _react2.default.createElement(
                'span',
                { className: 'month-year' },
                year
              )
            ),
            _react2.default.createElement('img', { className: 'calender-month-arrow-right', src: _ic_forward2.default, alt: 'forward', onClick: this.next.bind(this) })
          ),
          _react2.default.createElement(
            'div',
            { className: 'calender-footer' },
            header,
            days
          )
        )
      );
    }
  }]);

  return Calendar;
}(_react.Component);

;

Calendar.propTypes = {
  accentColor: _propTypes2.default.string,
  onDatePicked: _propTypes2.default.func,
  showHeader: _propTypes2.default.bool,
  orientation: _propTypes2.default.string
};

Calendar.defaultProps = {
  accentColor: '#00C1A6',
  onDatePicked: function onDatePicked() {},
  showHeader: true,
  orientation: 'flex-col'
};

exports.default = Calendar;
