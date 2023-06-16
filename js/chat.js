const form = document.getElementById('send-message');
const textMsg = document.getElementById('text-message');

const token = localStorage.getItem('token');

form.addEventListener('submit', addMessage);

function getMessages(){
    const msgArray = JSON.parse(localStorage.getItem('msgArray'));
    let lastMsgId;
    if(msgArray){
        lastMsgId = msgArray[msgArray.length-1].id;
    }
    axios.get(`http://localhost:3000/messages?lastMessageId=${lastMsgId}`, {headers: {"Authorization": token} })
        .then(response => {
            let newArray;
            // console.log("response>>>",response.data.messages," type>>>",typeof(response.data.messages));
            // console.log("msgArray>>>",msgArray, " type>>>",typeof(msgArray));
            if(msgArray){
                //newArray = msgArray;
                newArray = [...msgArray, ...response.data.messages];
            }
            else
                newArray = [...response.data.messages];
            // console.log("newArray>>>>",newArray[2]);
            if(newArray.length > 10){
                let diff = newArray.length - 10;
                while(diff>0){
                    newArray.shift();
                    diff--;
                }
            }
            localStorage.setItem('msgArray', JSON.stringify(newArray));
            newArray.forEach(message => {
                showMessageOnScreen(message);
            })
        })
        .catch(err => {
            console.log(err);
        })
}

window.addEventListener('DOMContentLoaded', () => {
    getMessages();
    
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

const interval = setInterval(() => {
    const parentElement = document.getElementById('messages');
    parentElement.innerHTML = '';
    getMessages();
}, 5000)

clearInterval(interval);

function addMessage(e){
    e.preventDefault();
    const token = localStorage.getItem('token');

    let obj = {
        message: textMsg.value
    }

    axios.post('http://localhost:3000/messages', obj, {headers: {"Authorization": token} })
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
    const parentElement = document.getElementById('messages');
    const childElement = `<li id=${obj.id} class="list-group-item"> ${obj.user.name}: ${obj.textMessage} </li>`
    parentElement.innerHTML = parentElement.innerHTML + childElement;
}