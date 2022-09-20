import React from 'react';
import { useState } from "react";

const Tickets = (props) => {
 const [newPrice, setnewPrice] = useState('');
 const submitHandler = (e) => {
   e.preventDefault();}
 
 return (
<div class="container mx-auto mt-4">
 <div class="row">
 {props.tickets.map((t) => (
   <div class="col-md-4">
	 <div class="card" style="width: 18rem;" key={t.index}>
 <img src={t.image} class="card-img-top" alt="..."/>
 <div class="card-body">
   <h5 class="card-title">Match fixture {t.fixture}</h5>
	   <h6 class="card-subtitle mb-2 text-muted">Match Venue {t.venue}</h6>
   <p class="card-text">{t.price / 1000000000000000000}cUSD</p>
	  <a href="#" class="btn mr-2" 	href="/#"
								   class="btn btn-success"
								   onClick={() =>
									   props.buyTicket(t.index)
								   }><i class="fas fa-link"></i> Buy Now</a>
  
  
   <a href="/#" class="btn"> 
				   <input
					 type="text"
					 className="form-control"
					 onChange={(e) => setnewPrice(e.target.value)}
					 placeholder="new date"
				   />
				   <button
					 type="submit"
					 onClick={() => props.UpdateTicketPrice(ticket.index, newPrice)}
					 className="btn btn-success"
				   >
					 Update Price
				   </button></a>
 </div>
 </div>
 )
 )}
 
   </div>
     
   </div>
	</div>
)

	 
}
export default Tickets;