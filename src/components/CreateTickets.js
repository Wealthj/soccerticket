import React from 'react'

import { useState } from "react";

const CreateTickets = (props) => {
const [image, setImage] = useState('');
 const [fixture, setFixture] = useState('');
 const [venue, setVenue] = useState('');
 const [price, setPrice] = useState();

 const submitHandler = (e) => {
    e.preventDefault();

    if(!image || !fixture || !venue || !price) {
        alert('Please fill up the form')
        return

    }
    props.CreateTicket(image, fixture, venue, price);
    
    setImage('')
    setFixture('')
    setVenue('')
    setPrice('')
};

return(
    <form className='YR' onSubmit={submitHandler}>
    <div class="form-row" >
      
        <input type="text" class="form-control" value={image}
             onChange={(e) => setImage(e.target.value)} placeholder="Image"/>

<input type="text" class="form-control mt-4" value={fixture}
           onChange={(e) => setFixture(e.target.value)} placeholder="Match fixture"/>

<input type="text" class="form-control mt-4" value={venue}
           onChange={(e) => setVenue(e.target.value)} placeholder="Match Venue"/>

 

<input type="text" class="form-control mt-4" value={price}
           onChange={(e) => setPrice(e.target.value)} placeholder="Ticket price"/>

<button type="submit" class="btn btn-outline-dark lk">Create Ticket</button>

</div>
</form>
  
)
}
export default  CreateTickets;
   