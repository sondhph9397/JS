const urlParams = new URLSearchParams(window.location.search);
const hospitalId = urlParams.get('id');
let patientUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}/patients`;
axios.get(patientUrl)
    .then(response => {
        if (response.data.length > 0) {
            let content = ``;
            response.data.map(function (item, index) {
                content += `<tr id="data-${item.id}">
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.age}</td>
                            <td>${item.bed_no}</td> 
                            <td>${item.description}</td>
                            <td><button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
                            data-dismiss="modal" 
                            onclick="editPatient(${item.id})">
                            Sửa </button>
                            <button type="button" class="btn btn-danger" 
                            onclick="removePatient(${item.id})">Xóa</button>
                            </td>
                           
                        </tr>`;
            });
            document.querySelector('tbody').innerHTML = content;
        }
    })
function removePatient(patienId) {
    let removeUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}/patients/${patienId}`;
    axios.delete(removeUrl)
        .then(response => {
            document.querySelector(`#data-${response.data.id}`).remove()
        })
}
function addPatient() {
    let data = {
        name: document.querySelector('[name="name"]').value,
        age: document.querySelector('[name="age"]').value,
        bed_no: document.querySelector('[name="bed_no"]').value,
        description: document.querySelector('[name="description"]').value
    };
    axios.post(patientUrl, data)
        .then(response => {
            let newRow = `<tr id="data-${response.data.id}">
                        <td>${response.data.id}</td>
                        <td>${response.data.name}</td>
                        <td>${response.data.age}</td>
                        <td>${response.data.bed_no}</td>
                        <td>${response.data.description}</td>
                        <td>
                        <button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
                            data-dismiss="modal" 
                            onclick="editPatient(${response.data.id})">
                            Sửa </button>
                            <button type="button" class="btn btn-danger" 
                            onclick="removePatient(${response.data.id})">Xóa</button>
                        </td>
                    </tr>`;
            let content = document.querySelector('tbody').innerHTML;
            content += newRow;
            document.querySelector('tbody').innerHTML = content;
        })
        .then(() => {
            $("#exampleModal").modal('hide');
        })
}
function editPatient(patienId) {
    let editUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}/patients/${patienId}`;
    axios.get(editUrl)
        .then(response => {
            document.querySelector('[name="nameEdit"]').value = response.data.name;
            document.querySelector('[name="ageEdit"]').value = response.data.age;
            document.querySelector('[name="bed_noEdit"]').value = response.data.bed_no;
            document.querySelector('[name="descriptionEdit"]').value = response.data.description;
            document.querySelector('.btn-save-edit').setAttribute("onclick", `saveEditPatient(${response.data.id})`);
        })
}
function saveEditPatient(patienId) {
    let data = {
        name: document.querySelector('[name="nameEdit"]').value,
        age: document.querySelector('[name="ageEdit"]').value,
        bed_no: document.querySelector('[name="bed_noEdit"]').value,
        description: document.querySelector('[name="descriptionEdit"]').value
    };
    let saveEditUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}/patients/${patienId}`;
    axios.put(saveEditUrl, data)
        .then(() => {
            axios.get(patientUrl)
                .then(response => {
                    if (response.data.length > 0) {
                        let content = ``;
                        response.data.map(function (item, index) {
                            content += `<tr id="data-${item.id}">
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.age}</td>
                    <td>${item.bed_no}</td> 
                    <td>${item.description}</td>
                    <td><button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
                    data-dismiss="modal" 
                    onclick="editPatient(${item.id})">
                    Sửa </button>
                    <button type="button" class="btn btn-danger" 
                    onclick="removePatient(${item.id})">Xóa</button>
                    </td>
                </tr>`;
                        });
                        document.querySelector('tbody').innerHTML = content;
                    }
                })
                .then(() => {
                    $("#exampleModalEdit").modal('hide');
                })
        })
}