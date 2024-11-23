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
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function DialogPrompt3() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");

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
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              type="text"
              id="cardNumber"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              type="text"
              id="cardholderName"
              placeholder="Cardholder Name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input
              type="text"
              id="expirationDate"
              placeholder="MM/YY"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              type="text"
              id="cvv"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}