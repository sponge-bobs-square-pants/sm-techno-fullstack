import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
const StudentForm = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    mobileNumber: '',
    city: 'Surat',
    cast: 'OBC',
    hobbies: [],
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === 'checkbox'
          ? checked
            ? [...prevData[name], value]
            : prevData[name].filter((item) => item !== value)
          : type === 'file' && isImageFile(files[0])
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'profileImage') {
        data.append(key, formData[key]);
      } else {
        data.append(key, JSON.stringify(formData[key]));
      }
    });
    try {
      const response = await axios.post(
        'http://localhost:5000/submitForm',
        data
      );
      if (response.status === 200) {
        console.log('Form data submitted successfully');
        toast.success('Form submitted successfully');
        setFormData({
          studentName: '',
          mobileNumber: '',
          city: 'Surat',
          cast: 'OBC',
          hobbies: [],
          profileImage: null,
        });
      } else {
        console.error('Error submitting form data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const isImageFile = (file) => {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file.type);
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getPDF', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'forms.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div>
      <StyledForm onSubmit={handleSubmit}>
        <h2> STUDENT FORM</h2>
        <StyledFormGroup>
          <StyledLabel>Student Name</StyledLabel>
          <StyledInput
            type='text'
            placeholder='Enter name'
            name='studentName'
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Student Mobile Number</StyledLabel>
          <StyledInput
            type='tel'
            placeholder='Enter mobile number'
            name='mobileNumber'
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>City</StyledLabel>
          <StyledSelect
            name='city'
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value='Surat'>Surat</option>
            <option value='Vadodara'>Vadodara</option>
            <option value='Ahemdabad'>Ahemdabad</option>
          </StyledSelect>
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Cast</StyledLabel>
          <StyledRadioLabel>
            <input
              type='radio'
              name='cast'
              value='OBC'
              checked={formData.cast === 'OBC'}
              onChange={handleChange}
            />
            OBC
          </StyledRadioLabel>
          <StyledRadioLabel>
            <input
              type='radio'
              name='cast'
              value='ST'
              checked={formData.cast === 'ST'}
              onChange={handleChange}
            />
            ST
          </StyledRadioLabel>
          <StyledRadioLabel>
            <input
              type='radio'
              name='cast'
              value='SC'
              checked={formData.cast === 'SC'}
              onChange={handleChange}
            />
            SC
          </StyledRadioLabel>
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Hobbies</StyledLabel>
          <StyledCheckboxLabel>
            <input
              type='checkbox'
              name='hobbies'
              value='Singing'
              checked={formData.hobbies.includes('Singing')}
              onChange={handleChange}
            />
            Singing
          </StyledCheckboxLabel>
          <StyledCheckboxLabel>
            <input
              type='checkbox'
              name='hobbies'
              value='Travelling'
              checked={formData.hobbies.includes('Travelling')}
              onChange={handleChange}
            />
            Travelling
          </StyledCheckboxLabel>
          <StyledCheckboxLabel>
            <input
              type='checkbox'
              name='hobbies'
              value='Reading'
              checked={formData.hobbies.includes('Reading')}
              onChange={handleChange}
            />
            Reading
          </StyledCheckboxLabel>
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Student Profile:</StyledLabel>
          <input
            type='file'
            name='profileImage'
            onChange={handleChange}
            accept='image/*'
          />
        </StyledFormGroup>

        <StyledButton type='submit'>Submit</StyledButton>
        <StyledButton
          type='button'
          style={{ marginLeft: '10px' }}
          onClick={handleDownloadPdf}
        >
          PDF
        </StyledButton>
      </StyledForm>
    </div>
  );
};
const StyledForm = styled.form`
  max-width: 400px;
  margin: auto;
`;

const StyledFormGroup = styled.div`
  margin-bottom: 15px;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
`;

const StyledRadioLabel = styled.label`
  margin-right: 10px;
`;

const StyledCheckboxLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const StyledButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
`;

export default StudentForm;
