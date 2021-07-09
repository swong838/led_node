import React from 'react';


const RemoteButton = ({ title, mode, body }) => {
    return (
        <button onClick={e => {
            e.preventDefault();
            fetch(`/remote/${mode}`, { 
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(body),
            });
        }}>
            {title}
        </button>
    );
};

export default RemoteButton;
