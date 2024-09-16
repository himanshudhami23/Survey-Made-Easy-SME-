'use client';

import React, { useState } from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { toast } from './ui/use-toast';
import { Dialog } from './ui/dialog'; // Ensure this path is correct

interface SalesforceUserMenuProps {
  initialUsername: string;
}

const SalesforceUserMenu: React.FC<SalesforceUserMenuProps> = ({ initialUsername }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // New state for confirmation dialog
  const [username, setUsername] = useState(initialUsername);

  const handleLogout = () => {
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  const confirmLogout = async () => {
    try {
      // Logout from Salesforce
      await fetch('/api/salesforce/logout', { method: 'POST' });

      // Logout from NextAuth
      await signOut({ redirect: false });

      // Open Salesforce login page in a new tab
      window.open('https://login.salesforce.com/', '_blank');

      // Refresh the current page
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!username) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-primary text-primary-foreground px-3 py-2 rounded-md"
      >
        <FaUser />
        <span>{username}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg">
          <div className="px-4 py-2 text-sm text-muted-foreground">
            Logged in as: {username}
          </div>
          <button
            onClick={handleLogout} // This now opens the confirmation dialog
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-left hover:bg-accent"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      )}
      <Dialog open={isConfirmOpen} onDismiss={() => setIsConfirmOpen(false)} useNewDialog={true}> {/* Added useNewDialog prop */}
        <div className="p-4">
          <h2 className="text-lg font-semibold">Confirm Logout</h2>
          <p>Are you sure you want to logout?</p>
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => setIsConfirmOpen(false)} 
              className="mr-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button 
              onClick={confirmLogout} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SalesforceUserMenu;