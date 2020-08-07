import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [room_1, setRoom1] = React.useState([]);
  const [room_2, setRoom2] = React.useState([]);
  const submitData = () => {
    const data = document.getElementById("Text1")
    console.log(data.value)
    const list = data.value.split("\n")
    const regex = /\d+/g;
    let totalTime = 0;
    let timeList = []
    const maxTimeAllow = 7*60*2;
    const titleTimeList = list.reduce((acc, eachLine) => {
      const [time] = eachLine.match(regex)
      const intTime = parseInt(time)
      timeList = [...time, ...[intTime]];
      totalTime = totalTime+intTime
      const splitStr = eachLine.split(time)
      return [...acc, ...[[splitStr[0], intTime]]];
    }, []).sort(function(a,b) {
      return  b[1] - a[1]
    })
    
    let room1 = [];
    let room2 = [];
    titleTimeList.forEach((element, index) => {
      if(index%2 === 0){
        room1 = [...room1, ...[element]]
      } else {
        room2 = [...room2, ...[element]]
      }
    })
    setRoom1(roomDustrubution(room1, "Room1"))
    setRoom2(roomDustrubution(room2, "Room2"))  
  }

  const roomDustrubution = (room, roomId) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9)
    tomorrow.setMinutes(0)
    tomorrow.setSeconds(0)
    tomorrow.setMilliseconds(0)
    const noonMaxTime = new Date(tomorrow)
    noonMaxTime.setHours(12)
    const lunchEndTime = new Date(tomorrow)
    lunchEndTime.setHours(13)
    const eveningMaxTime = new Date(tomorrow)
    eveningMaxTime.setHours(17)
    let tomorrowRoom1 = new Date(tomorrow)
    let id = 0;
    const room1Timedistribution = room.reduce((acc, element) => {
      const startDate = new Date(tomorrowRoom1)
      tomorrowRoom1.setMinutes( tomorrowRoom1.getMinutes() + element[1]);
      if (tomorrowRoom1 >= lunchEndTime && tomorrowRoom1 <= eveningMaxTime || tomorrowRoom1 <= noonMaxTime){
        const data = {
          id: id,
          start: startDate,
          end: new Date(tomorrowRoom1),
          resourceId: roomId,
          title: element[0],
          time:  element[1]
        }
          id = id+1
        return [...acc, ...[data]]
      } else if (tomorrowRoom1 > eveningMaxTime) {
        return acc
      } else {
        tomorrowRoom1 = new Date(lunchEndTime)
        tomorrowRoom1.setMinutes( tomorrowRoom1.getMinutes() + element[1]);
        const data = {
          id: id,
          start: startDate,
          end: new Date(tomorrowRoom1),
          resourceId: roomId,
          title: element[0],
          time:  element[1]
        }
        id = id+1
        return [...acc, ...[data]]
      }
    }, [])
    return room1Timedistribution;
  }


  return (
    <div className="App">
      <div class="topnav">
        <h2>Booking conference room</h2>
      </div>
      <br/>
      <textarea name="Text1" id="Text1" cols="90" rows="10"></textarea>
      <br />
      <button type="button" onClick={submitData}>Submit</button>
      <ul style={{"text-align": "left", "margin-left": "30%"}}>
        <li>Title can have multiple schedule with the same name.</li>
        <li>No talk title has numbers in it.</li>
        <li>All talk lengths are in minutes (not hours)</li>
        <li>There needs to be no gap between sessions</li>
        <li>If all session not set, some session automatic not set in list</li>
      </ul>
      {
        (room_1.length > 0 || room_2.length > 0) ?
        <>
          <table>
            <tr>
              <th>Room</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Title</th>
              <th>Duration</th>
            </tr>
            {
            [...room_1, ...room_2].map((element) => {
              return (
                <tr>
                  <td>{element["resourceId"]}</td>
                  <td>{String(element["start"])}</td>
                  <td>{String(element["end"])}</td>
                  <td>{element["title"]}</td>
                  <td>{element["time"]}</td>
                </tr>
              )
            })}
          </table>
          
        </>
        : null
      }
    </div>
  );
}

export default App;
