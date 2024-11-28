import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import React from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { Input } from "./ui/input"

export function DialogPrompt3() {
  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    
    setState((prev) => ({ ...prev, [name]: value }));
  }

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cardDetails = {
      cardNumber,
      cardholderName,
      expirationDate,
      cvv,
    };

    const response = await fetch("http://localhost:5000/submit-banking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(cardDetails),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Card details saved successfully");
      window.location.reload(); // Reload the page
    } else {
      alert(data.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Card Details</DialogTitle>
          <DialogDescription>Enter your card details below</DialogDescription>
        </DialogHeader>
        <div>
      <Cards
        number={state.number}
        expiry={state.expiry}
        cvc={state.cvc}
        name={state.name}
        focused={state.focus}
      />
      <form className="m-2">
        <Input
          type="number"
          name="number"
          placeholder="Card Number"
          value={state.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="m-1 p-1"
        />
        <Input
          type="text"
          name="name"
          placeholder="Cardholder Name"
          value={state.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="m-1 p-1"
        />
        <Input
          type="text"
          name="expiry"
          placeholder="Expiration Date"
          value={state.expiry}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="m-1 p-1"
        />
        <Input
          type="number"
          name="cvc"
          placeholder="CVV"
          value={state.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="m-1 p-1"
        />
      </form>
    </div>
      </DialogContent>
    </Dialog>
  );
}