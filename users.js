let users=[];

const addUser=({id, name, room})=>{
    name=name.trim().toLowerCase();
    room=room.trim().toLowerCase();

    const existingUser=users.find((user)=>user.name===name&&user.room===room);

    if(existingUser){
        return {error:"The user already exists!"};
    }

    const user={id, name, room};
    users.push(user);
    return users;
};

const removeUser=(id)=>{
    const index=users.findIndex(user=>user.id===id);
    if(index!==-1){
        return users.splice(index, 1)[0];
    }
};

const getUserById=(id)=>{
    const user=users.find((user)=>user.id===id);
    return user;
};

const getRoomUsers= (room)=>{
    room=room.trim().toLowerCase();

    const roomUsers=users.filter((user)=>user.room===room);
    return roomUsers;
};

module.exports = {addUser, removeUser, getUserById, getRoomUsers};