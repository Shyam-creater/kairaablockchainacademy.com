import React,{useState} from 'react'
import CourseDetailsPage from "../components/Course/CourseDetailsPage.js"
import { useParams } from 'react-router-dom'
import Header from '../components/Header.js';

const CoursePage = () => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
const {id}=useParams();
console.log(`CoursePage ${id}`)

  return (
    <div>
      <Header
       route={route}
       setRoute={setRoute}
       open={open}
       setOpen={setOpen}
      />
      <CourseDetailsPage id={id}/>
    </div>
  )
}

export default CoursePage
