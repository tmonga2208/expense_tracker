import { useState } from "react";
import { SelectItem, SelectTrigger, SelectContent } from "./ui/select";
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
import { Select, SelectValue } from "./ui/select";

export function DialogPrompt2() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [selectValue, setSelectValue] = useState("");

  const handleSubmit = async ( e :React.FormEvent ) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/submit-bill-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        date,
        description,
        amount,
        category,
        selectValue,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Bill data 3 saved successfully");
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
          <DialogTitle>Add An Expense</DialogTitle>
          <DialogDescription>Add Your Expense</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              type="text"
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              type="text"
              id="category"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="selectValue">Type</Label>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spent">Spent</SelectItem>
                <SelectItem value="received">Received</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}