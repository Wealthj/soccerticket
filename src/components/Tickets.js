import React from 'react';
import { useState } from "react";

const Tickets = (props) => {
 const [newPrice, setNewPrice] = useState('');
 const submitHandler = (e) => {
   e.preventDefault();}
 
 return (
<div class="container mx-auto mt-4">
 <div class="row">
 {props.tickets.map((t) => (
   <div class="col-md-4">
	 <div class="card" style={{width: '18rem'}} key={t.index}>
 <img src={t.image} class="card-img-top" alt="..."/>
 <div class="card-body">
   <h5 class="card-title">Match fixture: {t.fixture}</h5>
	   <h6 class="card-subtitle mb-2 text-muted">Match Venue: {t.venue}</h6>
   <p class="card-text">Price: {t.price / 1000000000000000000} cUSD</p>
   {t.owner !== props.address &&  t.forSale &&( <a href="/#" class="btn mr-2" 	
								   
								   onClick={() =>
									   props.buyTicket(t.index)
								   }><i class="fas fa-link"></i> Buy Now</a>)}

<p className="card-text">
                  <small>
                    {t.forSale
                      ? "Ticket is Available for sale"
                      : "Ticket is Not Available for sale"}
                  </small>
                </p>

  
{t.owner === props.address && (
   <a href="/#" class="btn"> 
				   <input
					 type="text"
					 className="form-control"
					 onChange={(e) => setNewPrice(e.target.value)}
					 placeholder="new price"
				   />
				   <button
					 type="submit"
					 onClick={() => props.UpdateTicketPrice(t.index, newPrice)}
					 className="btn btn-success"
				   >
					 Update Price
				   </button></a>)}

				   {/* // Make button visible to only the creator  */}
				   {t.owner === props.address && (
                      <button
                        className="btn btn-dark"
                        onClick={() => props.toggleSaleStatus(t.index)}
                      >
                        {t.forSale
                          ? "Toggle Ticket Not For Sale"
                          : "Toggle Ticket Available for sale"}
                      </button>
                    )}
 </div>
 </div>
 </div>
 )
 )}
 
   </div>
     
   </div>
   
	)


	 
}
export default Tickets;