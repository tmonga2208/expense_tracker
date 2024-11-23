import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Github } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";

function CardWithForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      toast({
        title: "Login Successful",
        description: "Successfully Logged In",
      });
      localStorage.setItem('username', username);
      localStorage.setItem('token', data.token);

      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    } else {
      alert(data.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your email below to login your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">UserName</Label>
              <Input
                id="name"
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button className="w-full mt-4" type='submit'>Submit</Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col">
          <div className="w-full flex items-center justify-center">
            <p className="text-zinc-500">Or Continue With</p>
          </div>
          <div className="w-full flex justify-around">
            <Button className="px-8 py-3 m-2"><Github />Github</Button>
            <Button className="px-8 py-3 m-2" onClick={handleGoogleLogin}><FaGoogle /> Google</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CardWithForm;