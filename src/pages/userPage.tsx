import { useState ,useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import AdminPanelLayout from '../components/admin-panel/admin-panel-layout';

export default function UserProfile() {
 const defaultUser = {
    username: 'johndoe',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    bio: 'Enthusiastic developer and tech lover',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    password: '********'
  };


  const [user, setUser] = useState(defaultUser);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }
      const response = await fetch('http://localhost:5000/user-info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    };

    fetchUserData();
  }, []);

  const othername = localStorage.getItem('username');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };


  const handleSaveChanges = async () => {
    console.log('Saving changes:', user);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    const response = await fetch('http://localhost:5000/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
    } else {
      const errorData = await response.json();
      alert(errorData.message);
    }
  };

  return (
    <AdminPanelLayout>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt={user.username} />
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl">{user.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">@{othername}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" value={user.fullName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={user.email} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={user.location} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" type="url" value={user.website} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" name="bio" value={user.bio} onChange={handleInputChange} />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={user.username} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={user.password} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>
    </AdminPanelLayout>
  );
}