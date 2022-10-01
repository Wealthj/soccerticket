import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import IERC from "./contract/IERC.abi.json";
import Ticket from "./contract/Ticket.abi.json";
import CreateTickets from "./components/CreateTickets";
import Tickets from "./components/Tickets";

const ERC20_DECIMALS = 18;

const contractAddress = "0xDAdE3A9E28Ee7a5EE8628F291cB4146f14F88a85";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
	const [contract, setcontract] = useState(null);
	const [address, setAddress] = useState(null);
	const [kit, setKit] = useState(null);
	const [cUSDBalance, setcUSDBalance] = useState(0);
	const [tickets, setTickets] = useState([]);

	const connectToWallet = async () => {
		if (window.celo) {
			try {
				await window.celo.enable();
				const web3 = new Web3(window.celo);
				let kit = newKitFromWeb3(web3);

				const accounts = await kit.web3.eth.getAccounts();
				const user_address = accounts[0];

				kit.defaultAccount = user_address;

				await setAddress(user_address);
				await setKit(kit);
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log("Error Occurred");
		}
	};

	useEffect(() => {
		connectToWallet();
	}, []);

	useEffect(() => {
		if (kit && address) {
			getBalance();
		}
	}, [kit, address]);

	useEffect(() => {
		if (contract) {
			getTickets();
		}
	}, [contract]);

	const getBalance = async () => {
		try {
			const balance = await kit.getTotalBalance(address);
			const USDBalance = balance.cUSD
				.shiftedBy(-ERC20_DECIMALS)
				.toFixed(2);
			const contract = new kit.web3.eth.Contract(
				Ticket,
				contractAddress
			);
			setcontract(contract);
			setcUSDBalance(USDBalance);
		} catch (error) {
			console.log(error);
		}
	};

	const getTickets = async () => {
		const ticketsLength = await contract.methods.getticketsLength().call();
		console.log(ticketsLength);
		const _tickk = [];
		for (let index = 0; index < ticketsLength; index++) {
			let _tickets = new Promise(async (resolve, reject) => {
				let ticket = await contract.methods.getTicket(index).call();

				resolve({
					index: index,
					owner: ticket[0],
					image: ticket[1],
					fixture: ticket[2],
					venue: ticket[3],
					price: ticket[4],
					forSale: ticket[5]
				});
			});
			_tickk.push(_tickets);
		}
		const _tickets = await Promise.all(_tickk);
		setTickets(_tickets);
		
	};

	const CreateTicket = async (_image, _fixture, _venue, price) => {
		const _price = new BigNumber(price)
			.shiftedBy(ERC20_DECIMALS)
			.toString();
		try {
			await contract.methods
				.newTicket(_image, _fixture, _venue, _price)
				.send({ from: address });
			getTickets();
		} catch (error) {
			console.log(error);
		}
	};
	const UpdateTicketPrice = async (_index, _newPrice) => {
		const newPrice = new BigNumber(_newPrice).shiftedBy(ERC20_DECIMALS).toString();
		console.log(_index);

		
		try {
		  await contract.methods.updateTicketCost(_index, newPrice).send({ from: address });
		  getTickets();
		  getBalance();
		} catch (error) {
		 console.log(error);
		 alert("The Ticket price has succesfully been updated")
		}};
	  
		const toggleSaleStatus = async (_index) => {
			try {
			  await contract.methods.toggleSaleStatus(_index).send({ from: address });
			  getTickets();
			  getBalance();
			} catch (error) {
			  console.log(error);
			}};
		

	 
 
	const buyTicket = async (_index) => {
		try {
			const cUSDContract = new kit.web3.eth.Contract(
				IERC,
				cUSDContractAddress
			);

			await cUSDContract.methods
				.approve(contractAddress, tickets[_index].price)
				.send({ from: address });
			await contract.methods.buyTicket(_index).send({ from: address });
			getTickets();
			getBalance();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
		{address && kit ? (
			<div>
				<Navbar balance={cUSDBalance} />

				<Tickets
					tickets={tickets}
					buyTicket={buyTicket}
					toggleSaleStatus={toggleSaleStatus}
					UpdateTicketPrice={UpdateTicketPrice}
					address={address}
				/>
				<CreateTickets CreateTicket={CreateTicket} />
			</div>
		) : (
			""
		)}
	</>
);
}

export default App;