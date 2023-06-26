const form = document.getElementById('createForm');
const groupName = document.getElementById('groupName');
const token = localStorage.getItem('token');

form.addEventListener('submit', joinGroup);

function joinGroup(e){
    e.preventDefault();
    let obj_group = {
        groupName: groupName.value
    }
    axios.post('http://localhost:3000/joinGroup', obj_group, {headers: {"Authorization": token} })
        .then(response => {
            // localStorage.setItem(response.data.group.name, []);
            alert(response.data.message);
            window.location.href = "chat.html";
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data.message);
            groupName.innerHTML = '';
        })
}
