import React from 'react';
import moment from 'moment';
import dateFns from 'date-fns';
import axios from 'axios';
import PropTypes from 'prop-types';

import PartySize from './PartySize.jsx';
import Time from './Time.jsx';
import DateSection from './DateSection.jsx';
import Calendar from './Calendar.jsx';
import NoAvailability from './conditional_messages/NoAvailability.jsx';
import TooBig from './conditional_messages/TooBig.jsx';
import TooFar from './conditional_messages/TooFar.jsx';
import AvailTimes from './conditional_messages/AvailTimes.jsx';

import '../../public/styles.css';

class Reservations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      partySize: 2,
      date: new Date(),
      clickedDate: 'Today',
      time: '6:00 PM',
      availTimeSlots: [],
      allData: null,
      bookings: null,
      resName: null,
      displayCalendar: false,
      noAvailMsg: false,
      findTableBtn: true,
      showNextAvail: false,
      tooBig: false,
      tooFar: false,
      availTimes: false,
    };

    this.handleSize = this.handleSize.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleClickCalendar = this.handleClickCalendar.bind(this);
    this.hideCalendar = this.hideCalendar.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.checkAvailability = this.checkAvailability.bind(this);
    this.getBookings = this.getBookings.bind(this);
    this.getBtnBack = this.getBtnBack.bind(this);
    this.noAvailability = this.noAvailability.bind(this);
  }

  handleSize(e) {
    this.setState({
      partySize: e.target.value,
    });
  }

  handleTime(e) {
    this.setState({
      time: e,
    });
  }

  handleDate(e) {
    this.setState({
      date: e,
    });
  }

  handleClickCalendar() {
    this.setState({
      displayCalendar: true,
    });
  }

  hideCalendar() {
    this.setState({
      displayCalendar: false,
    });
  }

  changeDate(e) {
    if (dateFns.format(e, 'ddd, M/D') === dateFns.format(moment(), 'ddd, M/D')) {
      this.setState({
        clickedDate: 'Today',
      });
    } else {
      this.setState({
        clickedDate: dateFns.format(e, 'ddd, M/D'),
      });
    }
  }

  getBtnBack() {
    this.setState({
      findTableBtn: true,
      showNextAvail: false,
      noAvailMsg: false,
      tooBig: false,
      tooFar: false,
      availTimes: false,
    });
  }

  noAvailability() {
    this.setState({
      noAvailMsg: true,
      findTableBtn: false,
      showNextAvail: false,
      tooBig: false,
      tooFar: false,
      availTimes: false,
    });
  }

  checkAvailability() {
    const timeSlots = [];
    
    const timeData = {
      '6:00 PM': this.state.allData[0]['6:00 PM'],
      '6:15 PM': this.state.allData[0]['6:15 PM'],
      '6:30 PM': this.state.allData[0]['6:30 PM'],
      '6:45 PM': this.state.allData[0]['6:45 PM'],
      '7:00 PM': this.state.allData[0]['7:00 PM'],
      '7:15 PM': this.state.allData[0]['7:15 PM'],
      '7:30 PM': this.state.allData[0]['7:30 PM'],
      '7:45 PM': this.state.allData[0]['7:45 PM'],
      '8:00 PM': this.state.allData[0]['8:00 PM'],
      '8:15 PM': this.state.allData[0]['8:15 PM'],
      '8:15 PM': this.state.allData[0]['8:30 PM'],
    }

    const checkTime = this.state.time.split(' ');
    const checkHour = checkTime[0].split(':');
    const hour = Number(checkHour[0]);

    for (const time in timeData) {
      if (timeData[time] >= this.state.partySize) {
        timeSlots.push(time);
      }
    }

    if (this.state.time === '3:30 PM') {
      if (timeSlots.includes('6:00 PM')) {
        this.setState({
          availTimeSlots: ['6:00 PM'],
          noAvailMsg: false,
          findTableBtn: false,
          showNextAvail: false,
          tooBig: false,
          tooFar: false,
          availTimes: true,
        });
      } else {
        this.noAvailability();
      }
    }

    if (hour >= 4 && hour <= 10) {
      if (timeSlots.length !== 0) {
        this.setState({
          availTimeSlots: timeSlots,
          noAvailMsg: false,
          findTableBtn: false,
          showNextAvail: false,
          tooBig: false,
          tooFar: false,
          availTimes: true,
        });
      } else {
        this.noAvailability();
      }
    }

    if (this.state.time === '11:00 PM') {
      if (timeSlots.includes('8:30 PM')) {
        this.setState({
          availTimeSlots: ['8:30 PM'],
          noAvailMsg: false,
          findTableBtn: false,
          showNextAvail: false,
          tooBig: false,
          tooFar: false,
          availTimes: true,
        });
      } else {
        this.noAvailability();
      }
    }

    if (checkTime[1] === 'AM' || hour < 3 || this.state.time === '3:00 PM' || this.state.time === '11:30 PM' || hour === 12) {
      this.noAvailability();
    }

    const future = this.state.date;
    const today = new Date();

    if (dateFns.differenceInCalendarDays(future, today) > 90) {
      this.setState({
        tooFar: true,
        findTableBtn: false,
        showNextAvail: false,
        tooBig: false,
        noAvailMsg: false,
        availTimes: false,
      });
    }

    // if (this.state.partySize > 6) {
    //   this.setState({
    //     tooBig: true,
    //     findTableBtn: false,
    //     showNextAvail: false,
    //     noAvailMsg: false,
    //     tooFar: false,
    //     availTimes: false,
    //   });
    // }
  }

  getBookings() {
    let parseId = window.location.href.split('/');
    const id = parseId[parseId.length - 1];
    axios.get(`/restaurants/${id}/reservations`)
      .then((res) => {
        const bookings = res.data.length;
        this.setState({
          bookings: bookings,
          resName: res.data[0].name,
          allData: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.getBookings();
  }

  render() {
    return (
      <div className="reservations">

        <div className="reservation-title-wrapper">
          <span className="make-res-title">Make a reservation</span>
        </div>

        <PartySize handleSize={this.handleSize} getBtnBack={this.getBtnBack} />

        <div className="date-time-wrapper">
          <DateSection handleClick={this.handleClickCalendar} clickedDate={this.state.clickedDate} />
          <Time handleTime={this.handleTime} getBtnBack={this.getBtnBack} selectedDate={this.state.date} />
        </div>

        {this.state.displayCalendar ? <Calendar hideCalendar={this.hideCalendar} handleDate={this.handleDate} changeDate={this.changeDate} getBtnBack={this.getBtnBack} selectedDate={this.state.date} /> : null}

        {this.state.findTableBtn ? <button className="find-table" onClick={this.checkAvailability}>Find a Table</button> : null}

        {this.state.availTimes ? <AvailTimes availTimeSlots={this.state.availTimeSlots} time={this.state.time} selectedDate={this.state.date} noAvailability={this.noAvailability} /> : null}

        {this.state.noAvailMsg ? <NoAvailability time={this.state.time} /> : null}

        {this.state.tooBig ? <TooBig resName={this.state.resName} /> : null}

        {this.state.tooFar ? <TooFar resName={this.state.resName} /> : null}

        <div className="bookings">
          <img src="https://s3-us-west-1.amazonaws.com/freeseats-imgs/Booking.png" height="18px" width="22px" />
          <span className="bookings-caption">Booked {this.state.bookings} times today</span>
        </div>

        {this.state.showNextAvail ? <button className="show-next-avail-btn">Show next available</button> : null}

      </div>
    );
  }
}

Reservations.propTypes = {
  urlId: PropTypes.string,
};

export default Reservations;
