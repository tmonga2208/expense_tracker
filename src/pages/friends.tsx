import React, { useEffect, useState } from 'react';
import AdminPanelLayout from '../components/admin-panel/admin-panel-layout';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

function FriendsPage() {
  const friends = [
    "John Doe", "Jane Doe", "Alice Doe", "Bob Doe", "Charlie Doe",
    "David Doe", "Eve Doe", "Frank Doe", "Grace Doe", "Henry Doe"
  ];
  const [filteredFriends, setFilteredFriends] = useState(friends);
  const [search, setSearch] = useState("");
    const [showResults, setShowResults] = useState(false); 
    
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilteredFriends(friends.filter(friend => friend.toLowerCase().includes(e.target.value.toLowerCase())));
  };

  const handleSearchClick = () => {
    setShowResults(true); 
  };

  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(`/history`);
    };
    
  const [addedFriends, setAddedFriends] = useState<string[]>(() => {
    const storedFriends = localStorage.getItem('addedFriends');
    return storedFriends ? JSON.parse(storedFriends) : [];
  });
    
    const handleAddFriend = (friend: string) => {
    if (!addedFriends.includes(friend)) {
      setAddedFriends([...addedFriends, friend]);
    }
    };
    
    useEffect(() => {
    localStorage.setItem('addedFriends', JSON.stringify(addedFriends));
  }, [addedFriends]);


  return (
    <AdminPanelLayout>
      <div className='m-4 p-4'>
        <div className='flex justify-between items-center mb-4'>
          <Input
            placeholder='Search People'
            value={search}
            onChange={handleSearch}
          />
          <Search
            className='cursor-pointer p-1'
            size={24}
            onClick={handleSearchClick} // Handle search click
          />
        </div>
        {showResults && ( 
          <div className="bg-white">
            {filteredFriends.map((friend, index) => (
              <p key={index} className='flex justify-between p-2'>
                {friend}
                    <div>
                    <span className='m-1'><Button onClick={() => handleAddFriend(friend)}>Add</Button></span>
                    </div>
              </p>
            ))}
          </div>
              )}
              <div className=''>
                  <h1>Friend List</h1>
                    <ul className='bg-white rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-1'>
                        {addedFriends.map((friend, index) => (
                            <li className='flex justify-between' key={index}>{friend}
                                <span className='m-2'><Button onClick={handleNavigation}>Details</Button></span>
                            </li>
                            
                        ))}
                    </ul>
              </div>
      </div>
    </AdminPanelLayout>
  );
}

export default FriendsPage;