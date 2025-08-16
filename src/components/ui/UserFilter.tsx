import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, X } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserFilterProps {
  selectedUser: string;
  onUserChange: (user: string) => void;
  users: string[];
  className?: string;
}

export const UserFilter: React.FC<UserFilterProps> = ({
  selectedUser,
  onUserChange,
  users,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleUserSelect = (user: string) => {
    onUserChange(user);
    setIsOpen(false);
  };

  const clearUser = () => {
    onUserChange('');
  };

  const getUserInitials = (user: string) => {
    return user.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`relative ${className}`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`
              text-xs flex items-center gap-1.5 px-3 py-1.5 h-7
              ${selectedUser ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}
            `}
          >
            <User className="h-3 w-3" />
            {selectedUser ? (
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {getUserInitials(selectedUser)}
                </div>
                <span className="truncate max-w-20">{selectedUser}</span>
              </div>
            ) : (
              <span>Tous</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <div className="text-xs font-medium text-gray-600 mb-2 px-2">Sélectionner un utilisateur</div>
          <DropdownMenuItem
            onClick={() => handleUserSelect('')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-4 h-4 bg-gray-400 text-white text-xs rounded-full flex items-center justify-center">
              T
            </div>
            <span>Tous les utilisateurs</span>
          </DropdownMenuItem>
          {users.map((user) => (
            <DropdownMenuItem
              key={user}
              onClick={() => handleUserSelect(user)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {getUserInitials(user)}
              </div>
              <span>{user}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedUser && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearUser}
          className="absolute -top-2 -right-2 h-5 w-5 p-0 text-gray-400 hover:text-gray-600 bg-white border border-gray-200 rounded-full shadow-sm"
        >
          <X className="h-2.5 w-2.5" />
        </Button>
      )}
    </div>
  );
};
