import React from 'react'

import { useState } from "react";

const CreateEvents = (props) => {
const [image, setImage] = useState('');
 const [theme, setTheme] = useState('');
 const [date, setDate] = useState('');
 const [location, setLocation] = useState('');
 const [price, setPrice] = useState();

 const submitHandler = (e) => {
    e.preventDefault();

    if(!image || !theme || !date || !location || !price) {
        alert('Please fill up the form')
        return

    }
    props.CreateEvent(image, theme, date, location, price);
    
    setImage('')
    setTheme('')
    setDate('')
    setLocation('')
    setPrice('')
};

return(
    <form className='YR' onSubmit={submitHandler}>
    <div class="form-row" >
      
        <input type="text" class="form-control" value={image}
             onChange={(e) => setImage(e.target.value)} placeholder="Image"/>

<input type="text" class="form-control mt-4" value={theme}
           onChange={(e) => setTheme(e.target.value)} placeholder="Theme of Event"/>

<input type="text" class="form-control mt-4" value={date}
           onChange={(e) => setDate(e.target.value)} placeholder="Date of Event"/>

<input type="text" class="form-control mt-4" value={location}
           onChange={(e) => setLocation(e.target.value)} placeholder="Location of Event"/>

<input type="text" class="form-control mt-4" value={price}
           onChange={(e) => setPrice(e.target.value)} placeholder="price"/>

<button type="submit" class="btn btn-outline-dark lk">Create Event</button>

</div>
</form>
  
)
}
export default  CreateEvents;
   