'use client'

import React, { useState, useEffect } from 'react'
import AdminPanelLayout from '../components/admin-panel/admin-panel-layout'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { UserPlus, User, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Define types
type User = {
  id: string
  username: string
}

export default function FriendsPage() {
  const [query, setQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [friends, setFriends] = useState<User[]>([])
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/history");
    
  }

  // Simulated API call for searching users
  const searchUsers = async (searchQuery: string): Promise<User[]> => {
    // In a real application, this would be an API call
    // For this example, we'll simulate some results
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate network delay
    const mockUsers: User[] = [
      { id: '1', username: 'Ayush' },
      { id: '2', username: 'Piyush' },
      { id: '3', username: 'Arnav' },
      { id: '4', username: 'Siddhanth' },
      { id: '5', username: 'Mitali' },
    ]
    return mockUsers.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  useEffect(() => {
    const fetchUsers = async () => {
      if (query) {
        const results = await searchUsers(query)
        setSearchResults(results)
      } else {
        setSearchResults([])
      }
    }

    fetchUsers()
  }, [query])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const addFriend = (user: User) => {
    setFriends(prevFriends => {
      if (!prevFriends.some(friend => friend.id === user.id)) {
        return [...prevFriends, user]
      }
      return prevFriends
    })
    setSearchResults(prevResults => 
      prevResults.filter(result => result.id !== user.id)
    )
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
                {searchResults.map(user => (
                  <li key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <span>{user.username}</span>
                    </div>
                    <Button onClick={() => addFriend(user)} size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </li>
                ))}
                {searchResults.length === 0 && (
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
                  <li key={friend.id} className="flex items-center justify-between">
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

