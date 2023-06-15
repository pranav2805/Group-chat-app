const form = document.getElementById('send-message');
const textMsg = document.getElementById('text-message');

const token = localStorage.getItem('token');

form.addEventListener('submit', addMessage);

window.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:3000/messages', {headers: {"Authorization": token} })
        .then(response => {
            response.data.messages.forEach(message => {
                showMessagesOnScreen(message);
            })
        })
        .catch(err => {
            console.log(err);
        })
})

function addMessage(e){
    e.preventDefault();
    const token = localStorage.getItem('token');

    let obj = {
        message: textMsg.value
    }

    axios.post('http://localhost:3000/messages', obj, {headers: {"Authorization": token} })
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        })
    
    textMsg.value = '';
}

function showMessagesOnScreen(obj) {
    const parentElement = document.getElementById('messages');
    const childElement = `<li id=${obj.id} class="list-group-item"> ${obj.user.name}: ${obj.textMessage} </li>`
    parentElement.innerHTML = parentElement.innerHTML + childElement;
}