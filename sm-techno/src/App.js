import React from 'react';
import StudentForm from './Component/studentForm';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <div>
      <StudentForm />
      <ToastContainer
        position='top-center'
        theme='dark'
        autoClose={2000}
        transition={Slide}
        newestOnTop={true}
        pauseOnFocusLoss={true}
        pauseOnHover={false}
      />
    </div>
  );
};

export default App;
