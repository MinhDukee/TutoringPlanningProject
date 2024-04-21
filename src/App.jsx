import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate
} from 'react-router-dom'
import {useField} from './hooks/index'
import '../style.css'

const Menu = (props) => {

  const appointmentlist = 
    [{time: 10,
    day: "Monday",
  tutor: "Tutor1"},
   {time: 9,
    day: "Monday",
  tutor: "Tutor2"},
  {time: 10,
    day: "Tuesday",
  tutor: "Tutor13"}]

  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Router>
        <div>
          <Link style={padding} to="/">Login</Link>
          <Link style = {padding} to = "/dashboard">dashboard</Link>
          <Link style = {padding} to = "/scheduler">scheduler</Link>
        </div>

        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path = "/scheduler/:id" element = {<Schedule sched = {props.tutorSchedules} addNew = {props.addNewAppointment}/>}/>
          <Route path = "/dashboard" element = {<Dashboard appointments = {props.appointments}/>}/>
          <Route path = "/scheduler" element = {<Scheduler tutors = {props.tutorSchedules}/>}/>
        </Routes>
      </Router>
      </div>
  )
}

const Login = ({}) => {
  const username = useField('text')
  const password = useField('text')
  const navigate = useNavigate()
  const { reset: usernamereset, ...usernameProps } = username
  const { reset: passwordreset, ...passwordProps } = password

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      username: username,
      password : password
    })
    navigate('/dashboard')
    
  }
  
  return (
    <div>
      <h2>Login:</h2>
      <form onSubmit={handleSubmit}>

        Username: 
        <input  {...usernameProps} /> 
        <br/> 
        Password: 
        <input {...passwordProps} />

        <button type = "submit">Login</button>
        <button onClick={() => {
          usernamereset()
          passwordreset()
        }} type = "reset"> reset </button> 
      </form>
    </div>
  )

}

const Scheduler = (props) => {
  const [time, setTime] = useState('00:00');
  const [hour, setHour] = useState(0);
  const [date, setDate] = useState('Monday');
  const [tutorstoshow, setTutorstoshow] = useState([]);

  const handleChange = (event) => {
    const time = event.target.value;
    console.log(time)
    const [hours, minutes] = time.split(':').map(x => parseInt(x, 10))
    setTime(time);
    setHour(hours)
  };

  useEffect(() => {
    console.log(hour);
    if (hour > 7 && hour < 18) {
      setTutorstoshow(filterTutors(props.tutors, hour, date));
    } else {
      setTutorstoshow([]);
    }
  }, [hour]);
  

  const handleDayChange = (event) => {
    setDate(event.target.value);
  };

  const filterTutors = (tutors, hour, date) => {
    const hourNumber = parseInt(hour, 10);
    return tutors.filter((tutor) => tutor.hours[hourNumber - 8][getIndex(date)] === 'Free');
  };

  const getIndex = (day) => {
    switch (day) {
      case 'Monday':
        return 0;
      case 'Tuesday':
        return 1;
      case 'Wednesday':
        return 2;
      case 'Thursday':
        return 3;
      case 'Friday':
        return 4;
      default:
        return -1;
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="time-input">Set a date for your appointment. Hour:</label>
        <input type="time" id="time-input" value={time} onChange={handleChange} />
        Day:
        <select id="mySelect" name="mySelect" value = {date} onChange = {handleDayChange}>
    <option value="Monday">Monday</option>
    <option value="Tuesday">Tuesday</option>
    <option value="Wednesday">Wednesday</option>
    <option value="Thursday">Thursday</option>
    <option value="Friday">Friday</option>
  </select>
      </div>

      <div className="box">
        <div>
          <h2 style={{ padding: '5px' }}>Possible Tutors:</h2>
        </div>

        <div className = "appointment">
          {tutorstoshow.map((tutor, index) => (
                  <ul> <li key={tutor.id}>
          <Link to={`/scheduler/${tutor.id}`}>{tutor.tutor}</Link>
        </li>
    </ul>
))}
    </div></div></div>
  );
};


const Dashboard = (props) =>{
  console.log(props.appointments)
  return(<div>
    <h1>My Dashboard</h1>
    
<div className = "box">
  <div><h2 style={{padding: "5px"}}>Upcoming Appointments</h2> </div>
  <div>
  {props.appointments.map((appointment) => (<div className = "appointment" key = {props.appointments.findIndex(x => x === appointment)}>
    Appointment with {appointment.tutor} at {appointment.time} o'clock on {appointment.day}
  </div>))}
  </div>
</div>


  </div>)
}

const Schedule = (props) => {
  const id = useParams().id
  const schedule = props.sched.find(n => n.id === Number(id)).hours
  const tutorname = props.sched.find(n => n.id === Number(id)).tutor
  const navigate = useNavigate()
  const [overlayActive, setOverlayActive] = useState(false);
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const getIndex = (day) => {
    switch (day) {case 0:return 'Monday';case 1:return 'Tuesday';case 2:return 'Wednesday';case 3:return 'Thursday';case 4:return 'Friday';default:return 'undefineddate';}};
const handleOpenModal = (hour, event) => {
  setOverlayActive(true);
  setTime(hour);
  const cell = event.target.parentNode;
  const columnIndex = cell.cellIndex;
  const day = (getIndex(columnIndex-1))
  setDate(day.toLocaleString("en-US", { weekday: "long" }));
};

  const handleCloseModal = () => {
    setOverlayActive(false);
  };

  const handleAppointment = (e) =>{
      e.preventDefault()
      props.addNew({
        time: time,
        day: date,
        tutor: tutorname
      })
      navigate('/dashboard')
  }

  return (
    <div>
      <h1>{tutorname}'s schedule:</h1>
      <p>

      </p>
      <table>
        <thead>
          <tr>
            <td className="btn noHover"></td>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((hours, index) => (
            <tr key={index}>
              <th>{8 + index}h</th>
              {hours.map(function (hour) { if (hour === "Free") {return(
                <td key={hour}>
                  <button
                    data-modal-target="#modal"
                    onClick={(event) => handleOpenModal(index +8, event)}
                    style={{
                      background: "none",
                      cursor: "pointer",
                      border: "none",
                      outline: "none",
                    }}
                  >
                    {hour}
                  </button>
                </td>
            ) }else{
              return(<td style = {{backgroundColor: "darkgray" }}>{hour}</td>)
            }} )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`modal ${overlayActive ? "active" : ""}`} id="modal">
        <div className="modal-header">
          <div className="title">Request Appointment with Tutor</div>
          <button data-close-button className="close-button" onClick={handleCloseModal}>
            &times;
          </button>
        </div>
        <div className="modal-body">
Would you like to request an appointment with the tutor at {time} o'clock on {date}?
<br></br>
<button style = {{  
  padding: "3px 9px 3px 9px",
  background : "white",
   cursor: "pointer",
    color: "black",
     outline : "none",
      border: "solid",
       borderRadius: "10px",
       marginLeft: "10px",
       marginBottom: "10px",
       float: "right",
            }} onClick = {handleAppointment}> Yes</button>
  
<button style = {{  
    padding: "3px 9px 3px 9px",
    background : "white",
     cursor: "pointer",
      color: "black",
       outline : "none",
        border: "solid",
         borderRadius: "10px",
         marginLeft: "10px",
         marginBottom: "10px",
         float: "right"
  }}>No</button>
        </div>
      </div>
      <div
        className={`overlay ${overlayActive ? "active" : ""}`}
        onClick={handleCloseModal}
      ></div>
    </div>
  );
};

const About = () => (
  <div>
    <h2>Tutoring Planning website</h2>

    <em>This is a site dedicated to planning Tutoring sessions. Please login to your account:</em>

    <p></p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const App = () => {

  /* THE TUTORING PLANNING STUFF*/

  const [appointments, setAppointments] = useState([])
  const [tutorschedules, setTutorschedules] = useState([{tutor: "tutor1",
  hours : [['Free','Not Free','Free','Free','Free'],['Free','Free','Free','Free','Free'],
  ['Free','Free','Free','Free','Free'],['Not Free','Free','Free','Free','Free']
  ,['Free','Not Free','Not Free','Free','Free'],['Free','Free','Free','Free','Free'],['Free','Free','Free','Free','Free']
  ,['Free','Free','Free','Free','Free'],['Free','Free','Free','Free','Free'],['Free','Free','Free','Free','Free']],
  id: 0}])
  const [users, setUsers] = useState([{status: 'student', username: 'MD', password: 'haha'},{status: 'tutor', username: 'Quan', password: 'hehe'}])

  const getIndex = (day) => {
    switch (day) {case 'Monday':return 0;case 'Tuesday':return 1;case 'Wednesday':return 2;case 'Thursday':return 3;case 'Friday':return 4;default:return -1;}};

  const addNewAppointment = (appointment) => {
    appointment.id = Math.round(Math.random() * 10000)
    console.log(appointment.day)
    const appointmentday = getIndex(appointment.day)
    const appointmenthour = (appointment.time-8) 
    const tutorIndex = tutorschedules.findIndex((tutor) => tutor.tutor === appointment.tutor)
    const updatedTutorschedules = [...tutorschedules]
    updatedTutorschedules[tutorIndex].hours[appointmenthour][appointmentday] = "Not Free"
    setTutorschedules(updatedTutorschedules)
    setAppointments(appointments.concat(appointment))
  }

  const checklogin = (logininfo) => {
    if (users.filter((user) => user.username === logininfo.username)){
      if (users.filter((user) => user.username === logininfo.username)[0].password === logininfo.password){

      }
    }


  }

    return (
    <div>
      <h1>Some stuff</h1>
      <Menu addNewAppointment = {addNewAppointment} appointments = {appointments} tutorSchedules = {tutorschedules}/>
      <Footer />
    </div>
  )
}

export default App
