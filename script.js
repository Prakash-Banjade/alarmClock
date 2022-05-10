  // Creating the live clock
  let timeContainer = document.getElementById('clock');
  let alarmTone = new Audio('alarmTone.mp3');
  Time();
  showAlarms();

  function Time() {
      let date = new Date();
      timeContainer.innerText = date.toLocaleTimeString();
      setTimeout(() => {
          Time();
      }, 1000);
  }

  //   Adding js on modal
  let date = new Date();

  //   Settingup hours
  let hours = document.getElementById('hours');
  let formattedHour = date.getHours();

  if (formattedHour > 12) {
      hours.value = formattedHour - 12;
  } else {
      hours.value = formattedHour;
  }

  hours.addEventListener('input', (e) => {
      if (hours.value.length != 2) {
          let strNum = String(hours.value);
          let formattedHour = strNum.slice(0, 2);
          hours.value = Number(formattedHour);
      }
      if (hours.value > 12 || hours.value < 0) {
          hours.value = 12;
      }
  })

  hours.addEventListener('blur', () => {
          if (hours.value < 1) {
              hours.value = 12;
          }
      })
      //   Setting up minutes
  let minutes = document.getElementById('minutes');
  minutes.value = date.getMinutes();
  minutes.addEventListener('input', (e) => {
      if (minutes.value.length != 2) {
          let strNum = String(minutes.value);
          let formattedMin = strNum.slice(0, 2);
          minutes.value = Number(formattedMin);
      }

      if (minutes.value > 59 || minutes.value < 0) {
          minutes.value = 00;
      }
  })

  minutes.addEventListener('blur', () => {
      if (minutes.value < 1) {
          minutes.value = 00;
      }
  })


  //   setting up days
  let Days = [];
  let days = document.getElementsByClassName('day');
  for (item of days) {
      item.addEventListener('input', (e) => {
          if (e.target.checked) {
              Days.push(e.target.id);
          } else {
              if (Days.indexOf(e.target.id) != -1) {
                  Days.splice(Days.indexOf(e.target.id), 1);
              }

          }
      })
  }






  // setting up periods
  let periods = document.getElementById('periods');
  //   console.log(periods.value)


  //   opening the Modal onclick

  let addAlarmBtn = document.getElementById('addAlarm');
  addAlarmBtn.addEventListener('click', (e) => {
      document.getElementById('modalContainer').style.display = 'flex';
  })


  // When clicked on done btn


  let done = document.getElementById('done');

  done.addEventListener('click', () => {
      let alarms = localStorage.getItem('alarms');
      let myAlarms;

      if (alarms == null) {
          myAlarms = [];
      } else {
          myAlarms = JSON.parse(localStorage.getItem('alarms'))
      }

      let myAlarmObj = {
          HOUR: hours.value,
          MINUTE: minutes.value,
          PERIOD: periods.value,
          DAYS: Days,
          TITLE: document.getElementById('alarmName').value,
          TOGGLE: true
      }

      myAlarms.push(myAlarmObj);
      localStorage.setItem('alarms', JSON.stringify(myAlarms))
      document.getElementById('modalContainer').style.display = 'none';
      showAlarms();
      let addAlarm = document.getElementById('addAlarm');
      addAlarm.classList.add('alarmSet');
      addAlarm.children[0].classList.replace('fa-plus', 'fa-check');

      setTimeout(() => {
          addAlarm.classList.remove('alarmSet');
          addAlarm.children[0].classList.replace('fa-check', 'fa-plus');
      }, 3000);
  })

  //   showing the alarms
  var toggleBtns;

  function showAlarms() {

      let alarms = localStorage.getItem('alarms');
      let myAlarms;

      if (alarms == null) {
          myAlarms = [];
      } else {
          myAlarms = JSON.parse(localStorage.getItem('alarms'))
      }



      let html = "";
      myAlarms.forEach(function(element, index) {
          let alarmDays = ``;
          let date = new Date();
          let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          element.DAYS.forEach(function(item) {
              if (item == weekDays[date.getDay()]) {

                  alarmDays += `<span style="color: yellow;">${item}</span> `
              } else {
                  alarmDays += `<span>${item}</span> `;
              }
          })



          html += ` <div class="alarm">
                      <h1>${element.HOUR}:${element.MINUTE} ${element.PERIOD}</h1>
                      <p>${alarmDays}</p>
                      <strong>${element.TITLE}</strong>
                      <div class="toggleAlarmParent">
                      <div class="toggleAlarm" id="toggleAlarm" title="Turn off alarm">
  
  
                      </div>
                  </div>
                      <i class="fas fa-times" id="${index}" title="Delete Alarm" onclick="delAlarm(this.id)"></i>
                  </div>`;
      })

      if (myAlarms.length != 0) {
          document.getElementById('alarmContainer').innerHTML = html;

      } else {
          document.getElementById('alarmContainer').innerHTML = `<p style="font-family: var(--primary-font); color: rgb(0 0 0 / .8); text-align: center;">No alarms set yet !</p>`;
      }
      toggleBtns = document.querySelectorAll('.toggleAlarm');
  }

  //   Deleting the alarm when click on cross

  function delAlarm(alarmInd) {
      let myAlarms = JSON.parse(localStorage.getItem('alarms'));
      myAlarms.splice(alarmInd, 1);
      localStorage.setItem('alarms', JSON.stringify(myAlarms));
      showAlarms();
  }

  //   canceling the alarm
  let cancelAlarmBtn = document.getElementById('cancel');
  cancelAlarmBtn.addEventListener('click', () => {
      document.getElementById('modalContainer').style.display = 'none';
  })

  // Toggling the alarm on or off
  toggleBtns.forEach(function(toggle) {
      toggle.addEventListener('click', (e) => {
          let targetedAlarm = e.target.parentNode.parentNode.children[4].id;
          console.log(targetedAlarm);
      })
  })









  //   Checking the Alarm to ring or not || Performing the actual work
  let x;
  checkingAlarm();

  function checkingAlarm() {

      x = setInterval(() => {

          checkAlarm();
      }, 1000);
  }


  function checkAlarm() {
      let alarms = localStorage.getItem('alarms');
      let myAlarms;

      if (alarms == null) {
          myAlarms = [];
      } else {
          myAlarms = JSON.parse(localStorage.getItem('alarms'))
      }
      let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let date = new Date();
      let currTime = date.toLocaleTimeString();
      let todayDay = weekDays[date.getDay()];
      myAlarms.forEach((element) => {
          let alarmTime = `${element.HOUR}:${element.MINUTE}`;
          let alarmPeriod = `${element.PERIOD}`;

          //   Alarm set without any weekdays
          if (element.DAYS.length == 0) {
              if (currTime.includes(alarmTime) && currTime.includes(alarmPeriod) && date.getSeconds() == 0 && element.TOGGLE == true) {
                  console.log('Alarm rang' + ' ' + alarmTime + ' ' + alarmPeriod + ' ' + 'No weekdays set');
                  alarmTone.addEventListener('ended', function() {
                      this.currentTime = 0;
                      this.play();
                  }, false);
                  alarmTone.play();
                  let palet = document.getElementById('alarmRingingPalet');
                  palet.style.display = 'flex';
                  palet.children[0].innerText = element.HOUR + ':' + element.MINUTE + ' ' + element.PERIOD;
                  palet.children[1].innerText = element.TITLE;

                  clearInterval(x);
                  setTimeout(() => {
                      checkingAlarm();
                      if (!alarmTone.paused) {
                          alarmTone.pause();
                          let palet = document.getElementById('alarmRingingPalet');
                          palet.style.display = 'none';
                      }
                  }, 60000);
              }
          }
          //   Alarm set with today weekday
          else if (element.DAYS.indexOf(todayDay) != -1) {
              element.DAYS.forEach(function(day) {
                  if (currTime.includes(alarmTime) && currTime.includes(alarmPeriod) && todayDay == day && date.getSeconds() == 0 && element.TOGGLE == true) {
                      console.log('Alarm rang' + alarmTime + alarmPeriod + ' ' + 'Setting the weekday' + `${day}`);
                      alarmTone.addEventListener('ended', function() {
                          this.currentTime = 0;
                          this.play();
                      }, false);
                      alarmTone.play();
                      let palet = document.getElementById('alarmRingingPalet');
                      palet.style.display = 'flex';
                      palet.children[0].innerText = element.HOUR + ':' + element.MINUTE + ' ' + element.PERIOD;
                      palet.children[1].innerText = element.TITLE;
                      clearInterval(x);
                      setTimeout(() => {
                          checkingAlarm();
                          if (!alarmTone.paused) {
                              alarmTone.pause();
                              let palet = document.getElementById('alarmRingingPalet');
                              palet.style.display = 'none';
                          }
                      }, 60000);
                  }

              })
          } else {
              //  Alarm set not for today, so do nothing, just wait
          };
      });
  }


  //   When clicked on dismiss alarm button

  let dismiss = document.getElementById('dismissAlarm');
  dismiss.addEventListener('click', function() {
      alarmTone.pause();
      let palet = document.getElementById('alarmRingingPalet');
      palet.style.display = 'none';

  })