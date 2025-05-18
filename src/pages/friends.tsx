'use client'

import React, { useState, useEffect } from 'react'
import AdminPanelLayout from '../components/admin-panel/admin-panel-layout'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { UserPlus, User, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { ToastProvider } from "../components/ui/toast-context"
import { useToast } from "../components/ui/use-toast"

// Define types
type User = {
  _id: string
  username: string
}

function FriendsPageContent() {
  const [query, setQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [friends, setFriends] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigate = () => {
    navigate(`/history/${friends[0].username}`);
  }

  // Fetch user's friends
  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view your friends",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/friends/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Error",
        description: "Failed to fetch friends. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Search users
  const searchUsers = async (searchQuery: string): Promise<User[]> => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        toast({
          title: "Authentication Error",
          description: "Please log in to search for users",
          variant: "destructive",
        });
        navigate('/login');
        return [];
      }

      const response = await axios.get(`http://localhost:5000/friends/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  }

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (query) {
        setLoading(true);
        const results = await searchUsers(query);
        setSearchResults(results);
        setLoading(false);
      } else {
        setSearchResults([]);
      }
    }

    fetchUsers();
  }, [query]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }

  const addFriend = async (user: User) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        toast({
          title: "Authentication Error",
          description: "Please log in to add friends",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/friends/${userId}/add/${user._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.message === 'Friend added successfully') {
        toast({
          title: "Success",
          description: `Added ${user.username} as a friend`,
        });
      } else if (response.data.message === 'Already friends with this user') {
        toast({
          title: "Info",
          description: `${user.username} is already your friend.`,
        });
      }
      // Always refresh the friends list
      fetchFriends();

    } catch (error: unknown) {
      const isAxiosError = (err: unknown): err is AxiosError<{ message: string }> => {
        return (
          typeof err === 'object' &&
          err !== null &&
          'isAxiosError' in err &&
          (err as AxiosError).isAxiosError === true
        );
      };
      if (isAxiosError(error) && error.response?.data?.message === 'Already friends with this user') {
        toast({
          title: "Info",
          description: `${user.username} is already your friend.`,
        });
        fetchFriends();
      } else {
        console.error('Error adding friend:', isAxiosError(error) ? error.response?.data : error);
        toast({
          title: "Error",
          description: isAxiosError(error) ? error.response?.data?.message : "Failed to add friend. Please try again.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <AdminPanelLayout>
      <div className="container mx-auto py-8 px-8">
        <h1 className="text-3xl font-bold mb-8">Friend Search</h1>
        <div className="flex items-center space-x-2 mb-8">
          <Input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search for users..."
            className="flex-grow"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {loading ? (
                  <li className="text-gray-500">Searching...</li>
                ) : (
                  searchResults.map(user => (
                    <li key={user._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-500" />
                        <span>{user.username}</span>
                      </div>
                      <Button onClick={() => addFriend(user)} size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </li>
                  ))
                )}
                {!loading && searchResults.length === 0 && (
                  <li className="text-gray-500">No results found</li>
                )}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Added Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {friends.map(friend => (
                  <li key={friend._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <span>{friend.username}</span>
                    </div>
                    <Button size="sm" onClick={handleNavigate}>Details</Button>
                  </li>
                ))}
                {friends.length === 0 && (
                  <li className="text-gray-500">No friends added yet</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPanelLayout>
  )
}

export default function FriendsPage() {
  return (
    <ToastProvider>
      <FriendsPageContent />
    </ToastProvider>
  );
}

