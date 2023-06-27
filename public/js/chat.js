const form = document.getElementById('send-message');
const textMsg = document.getElementById('text-message');

const token = localStorage.getItem('token');

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

window.addEventListener('DOMContentLoaded', () => {

    axios.get('http://localhost:3000/getGroups', {headers: {"Authorization": token}})
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
    //console.log(typeof(groupID));
    getMessagesFromGroup(groupID);
    
    // axios.get(`http://localhost:3000/messages`, {headers: {"Authorization": token} })
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

function addMessage(e){
    e.preventDefault();
    const token = localStorage.getItem('token');

    let obj = {
        message: textMsg.value
    }

    axios.post(`http://localhost:3000/messages?groupId=${groupID}`, obj, {headers: {"Authorization": token} })
        .then(response => {
            console.log("response>>>",response);
            showMessageOnScreen(response.data);
        })
        .catch(err => {
            console.log(err);
        })
    
    textMsg.value = '';
}

function showMessageOnScreen(obj) {
    let parentElement = document.getElementById('messages');
    let childElement;
    if(decodedToken.userId === obj.userId){
        childElement = `<li id=${obj.id} class="list-group-item" style="margin-left:auto"> You: ${obj.textMessage} </li>`
    }else{
        childElement = `<li id=${obj.id} class="list-group-item" style="margin-right:auto"> ${obj.user.name}: ${obj.textMessage} </li>`
    }
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
            if(group.isAdmin === true){
                document.getElementById('buttons').innerHTML = `<a href="addUser.html"><button>Add user</button></a>
                                                                <a href="removeUser.html"><button>Remove user</button></a>
                                                                <a href="makeAdmin.html"><button>Make Admin</button></a>`
            }
            break;
        }
    }
    const groupChats = JSON.parse(localStorage.getItem(groupID));
    let lastMsgId;
    if(groupChats && groupChats.length>0){
        lastMsgId = groupChats[groupChats.length-1].id;
    }
    axios.get(`http://localhost:3000/getMessages?groupId=${groupId}&lastMessageId=${lastMsgId}`, {headers: {"Authorization": token} })
        .then(response => {
            // console.log(response);
            let newArray;
            if(groupChats){
                newArray = [...groupChats, ...response.data.messages];
            }
            else
                newArray = [...response.data.messages];
            document.getElementById('messages').innerHTML = '';
            localStorage.setItem(groupID, JSON.stringify(newArray));
            newArray.forEach(message => {
                showMessageOnScreen(message);
            })
            // response.data.messages.forEach(message => {
            //     showMessageOnScreen(message);
            // })
        })
        .catch(err => {
            console.log(err);
        })
}