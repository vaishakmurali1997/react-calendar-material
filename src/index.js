import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import ic_back from './ic_back.svg';
import ic_forward from './ic_forward.svg';
import { log } from 'util';

const config = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    month_subs: ['Jan', 'Feb', 'Apr', 'Mar', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    weeks: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    week_subs: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
    today: function() {
      return new Date();
    }
}

const TODAY = config.today();

class Calendar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      current: config.today(),
      selected: config.today(),
      ldom: 30
    };
  }

  componentWillMount() {
    this.updateMonth(0);
  }

  updateMonth(add) {
    var d = this.state.current;
    d.setMonth(d.getMonth() + add);
    var eom = new Date(d.getYear(), d.getMonth() + 1, 0).getDate();
    this.setState({
      current: d,
      ldom: eom
    });
  }

  prev() {
    this.updateMonth(-1);
  }

  next() {
    this.updateMonth(1);
  }

  _onDatePicked(month, day) {
    var d = new Date(this.state.current.getTime());
    d.setMonth(d.getMonth() + month);
    d.setDate(day);
    this.props.onDatePicked(d);
    this.setState({
      selected: d
    });
  }

  renderDay(opts={}) {
    var baseClasses = "calender-day calender-noselect calender-non-current";
    var today = "";
    var selectFlag = false; 
    var todayStyle = {};
    var containerStyle = {};
    if( opts.today) {
      today = "current";
      todayStyle = {
        borderColor: this.props.accentColor,
      };
    }

    var selected = "";
    var selectedStyle = {};
    if( opts.selected ) {
      selected = "calender-selected";
      selectedStyle = {
        backgroundColor: this.props.accentColor
      }
      containerStyle = {
        color: '#3498DB'
      }
    }
    console.log(opts.date.getMonth());
    opts.selectedDayList
    // write the month logic here. 
    if(opts.selectedDayList != ""){
      for(let index = 0; index < opts.selectedDayList.length; index++){
        let cmpDate = new Date(opts.selectedDayList[index]); 
        if(cmpDate.getDate() == opts.date.getDate() && cmpDate.getMonth() == opts.date.getMonth()){
          baseClasses = "calender-day calender-noselect"
          selectFlag = true; 
        }
      }
    }
    
    return (<div className={baseClasses}
                style={containerStyle}>
              <div className={today} style={todayStyle}></div>
              <div className={selected} style={selectedStyle}></div>
              <p onClick={ (ev) => {
                var day = ev.target.innerHTML;
                selectFlag?
                this._onDatePicked(opts.month, day) :""
              }}>{opts.date.getDate()}</p>
            </div>);
  }

  renderDays(copy) {
    
    // if(this.props.selectedDays.length === 0) return null
    var days =  []; 
    var selectedDay = []; 
    
    if(this.props.selectedDays != undefined || this.props.selectedDays != []){ 
      for(let i = 0; i < this.props.selectedDays.length; i++){
        selectedDay.push(new Date(this.props.selectedDays[i].date)); 
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
      var isSelected = (sel.getFullYear() === copy.getFullYear() &&
          sel.getDate() === copy.getDate() &&
          sel.getMonth() === copy.getMonth());

      var isToday = (TODAY.getFullYear() === copy.getFullYear() &&
          TODAY.getDate() === copy.getDate() &&
          TODAY.getMonth() === copy.getMonth());

      // console.log("this is updated copy: ", copy);
      
      days.push(this.renderDay({
        today: isToday,
        selected: isSelected,
        selectedDayList: selectedDay || "", 
        current: inMonth,
        month: (inMonth ? 0 : (lastMonth ? -1 : 1)),
        date: copy
      }));
    }

    return days;
  }

  renderHeaders() {
    var header = [];

    for (var i = 0; i < config.week_subs.length; i++) {
      header.push(<p className='calender-day-headers calender-noselect'>
                    {config.week_subs[i]}
                  </p>);
    }

    return header;
  }


  componentWillReceiveProps(nextProps) {
    if(nextProps != undefined){
      if(nextProps.selectedDays[0] != undefined){
        this.setState({ current: new Date(nextProps.selectedDays[0].date) });
      }
    }
  }

  render() {
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
    console.log("Just a log 2 : ",this.props.selectedDays); 
    var upperDate = null;
    if( this.props.showHeader ) {
      upperDate = (<div className='flex-2 calender-header center' style={{
          backgroundColor: this.props.accentColor
        }}>
        <p className="calender-header-month">{tMonth.toUpperCase()}</p>
        <p className="calender-header-day">{tDate}</p>
      </div>);
    }
    return (<div className={this.props.orientation}>
      {upperDate}
      <div className="calender-padding">
        <div className='calender-month'>
          <img className="calender-month-arrow-left" src={ic_back} alt="back" onClick={this.prev.bind(this)}></img>
          <p className="calender-month-title">{month}<br/>
          <span className="month-year">{year}</span>
          </p>
          <img className="calender-month-arrow-right" src={ic_forward} alt="forward" onClick={this.next.bind(this)}></img>
        </div>
        <div className='calender-footer'>
          {header}
          {days}
        </div>
      </div>
    </div>);
  }

};

Calendar.propTypes = {
  accentColor: PropTypes.string,
  onDatePicked: PropTypes.func,
  showHeader: PropTypes.bool,
  orientation: PropTypes.string,
};

Calendar.defaultProps = {
  accentColor: '#00C1A6',
  onDatePicked: function(){},
  showHeader: true,
  orientation: 'flex-col'
};

export default Calendar;
