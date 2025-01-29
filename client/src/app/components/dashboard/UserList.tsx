import React from 'react';
import { User } from '@/app/utils/useUsers';

interface UserListProps {
    users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
    return (
        <ul>
            {users.map((user) => (
                <li key={user.iin}>
                    {user.full_name} — {user.city}
                </li>
            ))}
        </ul>
    );
};

export default UserList;
