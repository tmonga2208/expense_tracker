import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from ".//ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Github } from "lucide-react"
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSignIn } from '@clerk/clerk-react';

function CardWithForm2() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
    const navigate = useNavigate(); 
    const { signIn } = useSignIn();

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
      if (response.ok) {
        localStorage.setItem('username', username);
        alert('Signup successful');
        navigate('/dashboard');
        
    } else {
      alert(data);
    }
  };
   const handleGoogleAuth = async () => {
    try {
      await signIn?.authenticateWithRedirect({
        strategy: 'oauth_google',
      });
    } catch (error) {
      console.error('Google authentication failed:', error);
    }
  };

  const handleGithubAuth = async () => {
    try {
      await signIn?.authenticateWithRedirect({
        strategy: 'oauth_github',
      });
    } catch (error) {
      console.error('GitHub authentication failed:', error);
    }
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>SignUp</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
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
          <Button className="px-8 py-3 m-2" onClick={handleGithubAuth}><Github />Github</Button>
          <Button className="px-8 py-3 m-2" onClick={handleGoogleAuth}><FaGoogle /> Google</Button>
        </div>
      </div>
      </CardFooter>
    </Card>
  )
}

export default CardWithForm2