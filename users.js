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

    console.log("index: ", index);

    if(index!==-1){
        return users.splice(index, 1)[0];
    }
};

const getUserById=(id)=>{
    const user=users.find((user)=>user.id===id);

    console.log(users);

    return user;
};

module.exports = {addUser, removeUser, getUserById};