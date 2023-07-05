// import { io } from "socket.io-client";
// const io = require('socket.io-client');
const socket = io('http://localhost:5000');
const form = document.getElementById('send-message');
const textMsg = document.getElementById('text-message');

const token = localStorage.getItem('token');

socket.on("message-received", () => {
    getMessagesFromGroup(groupID);
});

socket.on("groupUpdated", () => {
    getGroups();
})

let groupID;
let groups
let parsedObject = JSON.parse(localStorage.getItem('groups'));
if(parsedObject){
    groups = parsedObject.group;
    if(groups && groups.length>1)
        groupID = groups[0].groupId;
}

form.addEventListener('submit', addMessage);

function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
}

const decodedToken = parseJwt(token);

function getGroups() {
    axios.get('http://localhost:5000/getGroups', {headers: {"Authorization": token}})
        .then(response => {
            localStorage.setItem('groups', JSON.stringify(response.data));
            response.data.group.forEach(response => {
                showGroupsOnScreen(response);
            })
        })
        .catch(err => {
            console.log(err);
        })
}

window.addEventListener('DOMContentLoaded', () => {

    axios.get('http://localhost:5000/getGroups', {headers: {"Authorization": token}})
        .then(response => {
            localStorage.setItem('groups', JSON.stringify(response.data));
            response.data.group.forEach(response => {
                showGroupsOnScreen(response);
            })
        })
        .catch(err => {
            console.log(err);
        })

    groupID = JSON.parse(localStorage.getItem('lastOpenedGroup'));
    getMessagesFromGroup(groupID);
    
    // axios.get(`http://localhost:5000/messages`, {headers: {"Authorization": token} })
    // .then(response => {
    //     response.data.messages.forEach(message => {
    //         showMessageOnScreen(message);
    //     })
    // })
    // .catch(err => {
    //     console.log(err);
    // })
})

// const interval = setInterval(() => {
//     const parentElement = document.getElementById('messages');
//     parentElement.innerHTML = '';
//     getMessages();
// }, 5000)

// clearInterval(interval);

async function addMessage(e){
    e.preventDefault();
    const token = localStorage.getItem('token');
    const message = textMsg.value;

    if(message.trim() === ''){
        return;
    }

    let obj = {
        message: textMsg.value
    }

    axios.post(`http://localhost:5000/messages?groupId=${groupID}`, obj, {headers: {"Authorization": token} })
        .then(response => {
            // console.log("response>>>",response);
            showMessageOnScreen(response.data);
            socket.emit('send-message', () => {
                console.log('Send message is being emmitted!!');
            })
        })
        .catch(err => {
            console.log(err);
        })
    // showMessageOnScreen(obj)
    // await socket.emit('send-message', obj, groupID, {headers: {"Authorization": token} })
    
    textMsg.value = '';
}

function showMessageOnScreen(obj) {
    let parentElement = document.getElementById('message-body');
    let childElement;
    if(decodedToken.userId === obj.userId){
        // childElement = `<li id=${obj.id} class="list-group-item" style="margin-left:auto"> You: ${obj.textMessage} </li>`
        childElement = `<div style="margin-left:auto"> <b>You:</b> ${obj.textMessage} </div>`
    }else{
        // childElement = `<li id=${obj.id} class="list-group-item" style="margin-right:auto"> ${obj.user.name}: ${obj.textMessage} </li>`
        childElement = `<div style="margin-right:auto"> <b>${obj.user.name}:</b> ${obj.textMessage} </div>`
    }
    // childElement = `<div> ${obj.message} </div>`
    parentElement.innerHTML = parentElement.innerHTML + childElement;
}

//to show group names on screen
function showGroupsOnScreen(obj){
    const groupsUL = document.getElementById('groups');
    const childElement = `<li id=${obj.groupId} class="list-group-item"> <a onclick="getMessagesFromGroup(${obj.groupId})">${obj.groupName} </a> </li>`
    groupsUL.innerHTML = groupsUL.innerHTML + childElement;
}

function getMessagesFromGroup(groupId){
    groupID = groupId;  //groupID => global flag variable used while sending message to particular group 
    localStorage.setItem('lastOpenedGroup', groupId);
    for(let group of groups){
        if(group.groupId === groupId){
            document.getElementById('groupname').innerHTML = '';
            document.getElementById('groupname').innerHTML = `<h4>${group.groupName}</h4>`
            document.getElementById('dropdown').innerHTML = '';
            if(group.isAdmin === true){
                // document.getElementById('buttons').innerHTML = `<a href="addUser.html"><button>Add user</button></a>
                //                                                 <a href="removeUser.html"><button>Remove user</button></a>
                //                                                 <a href="makeAdmin.html"><button>Make Admin</button></a>`
                const parentElement = document.getElementById('dropdown');
                const childElement = `<button type="button" class="dropbtn">Group Admin</button>
                                        <div class="dropdown-content" id="admin-actions">
                                            <a href="addUser.html">Add user</a>
                                            <a href="removeUser.html">Remove user</a> 
                                            <a href="makeAdmin.html">Make someone as admin</a>
                                        </div>`
                parentElement.innerHTML = parentElement.innerHTML + childElement;
            }
            break;
        }
    }
    const groupChats = JSON.parse(localStorage.getItem(groupID));
    let lastMsgId;
    if(groupChats && groupChats.length>0){
        lastMsgId = groupChats[groupChats.length-1].id;
    }
    axios.get(`http://localhost:5000/getMessages?groupId=${groupId}&lastMessageId=${lastMsgId}`, {headers: {"Authorization": token} })
        .then(response => {
            // console.log(response);
            let newArray;
            if(groupChats){
                newArray = [...groupChats, ...response.data.messages];
            }
            else
                newArray = [...response.data.messages];
            document.getElementById('message-body').innerHTML = '';
            localStorage.setItem(groupID, JSON.stringify(newArray));
            newArray.forEach(message => {
                showMessageOnScreen(message);
            })
        })
        .catch(err => {
            console.log(err);
        })
}