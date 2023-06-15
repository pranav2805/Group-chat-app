const form = document.getElementById('send-message');
const textMsg = document.getElementById('text-message');

form.addEventListener('submit', addMessage);

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
}