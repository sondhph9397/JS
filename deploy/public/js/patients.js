const urlParams = new URLSearchParams(window.location.search);
const hospitalId = urlParams.get('id');
window.SystemCore = {
    baseApiUrl: `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}/patients`,
    hospitalApiUrl: `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}`,
    fetchData: function () {
        fetch(this.hospitalApiUrl)
            .then(function (response) {
                return response.json();
            })
        fetch(this.baseApiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                if (data.length > 0) {
                    let content = ``;
                    data.map(function (item, index) {
                        content += `<tr id="data-${item.id}" >
                        <td>${item.id}</td>
                        <td>${item.hospitalId}</td>
                        <td>${item.name}</td>
                        <td>${item.age}</td>
                        <td>${item.bed_no}</td>
                        <td>${item.description}</td>
                       <td><button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
                       data-dismiss="modal" onclick="SystemCore.editPatient(${item.id})">
                           Sửa
                       </button></td>
                       <td><button type="button" class="btn btn-danger" onclick="SystemCore.removePatient(${item.id})">Xóa</button></td>
                    </tr>`;
                    });
                    document.querySelector('tbody').innerHTML = content;
                }
            })
    },
    addPatient: function () {
        let data = {
            name: document.querySelector('[name="name"]').value,
            age: document.querySelector('[name="age"]').value,
            bed_no: document.querySelector('[name="bed_no"]').value,
            description: document.querySelector('[name="description"]').value,
        };
        let baseApiUrl = this.baseApiUrl;
        fetch(baseApiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(function (item) {
                let newRow = `<tr id="data-${item.id}" >
            <td>${item.id}</td>
            <td>${item.hospitalId}</td>
            <td>${item.name}</td>
            <td>${item.age}</td>
            <td>${item.bed_no}</td>
            <td>${item.description}</td>
            <td><button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
            data-dismiss="modal" onclick="SystemCore.editPatient(${item.id})">
               Sửa
            </button></td>
            <td><button type="button" class="btn btn-danger" onclick="SystemCore.removePatient(${item.id})">Xóa</button></td>
            </tr>`;
                let content = document.querySelector('tbody').innerHTML;
                content += newRow;
                document.querySelector('tbody').innerHTML = content;
            })
            .then(() => {
                $("exampleModal").modal('hide');
            })
    },
    editPatient: function (patientId) {
        let editUrl = `${this.baseApiUrl}/${patientId}`;
        fetch(editUrl)
            .then(response => response.json())
            .then(data => {
                document.querySelector('[name="nameEdit"]').value = data.name;
                document.querySelector('[name="ageEdit"]').value = data.age;
                document.querySelector('[name="bed_noEdit"]').value = data.bed_no;
                document.querySelector('[name="descriptionEdit"]').value = data.description;
                document.querySelector('.btn-save-edit').setAttribute("onclick", `SystemCore.saveEditPatient(${data.id})`);
            })
    },
    saveEditPatient: function (patientId) {
        let editUrl = `${this.baseApiUrl}/${patientId}`;
        let data = {
            name: document.querySelector('[name="nameEdit"]').value,
            age: document.querySelector('[name="ageEdit"]').value,
            bed_no: document.querySelector('[name="bed_noEdit"]').value,
            description: document.querySelector('[name="descriptionEdit"]').value,
        };
        fetch(editUrl, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(() => {
                fetch(this.baseApiUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);
                        if (data.length > 0) {
                            let content = ``;
                            data.map(function (item, index) {
                                content += `<tr id="data-${item.id}" >
                                <td>${item.id}</td>
                                <td>${item.hospitalId}</td>
                                <td>${item.name}</td>
                                <td>${item.age}</td>
                                <td>${item.bed_no}</td>
                                <td>${item.description}</td>
                                <td><button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
                                data-dismiss="modal" onclick="SystemCore.editPatient(${item.id})">
                                   Sửa
                                </button></td>
                                <td><button type="button" class="btn btn-danger" onclick="SystemCore.removePatient(${item.id})">Xóa</button></td>
                                </tr>`;
                            });
                            document.querySelector('tbody').innerHTML = content;
                        }
                    })
            })
            .then(() => {
                $("#exampleModalEdit").modal('hide');
            })
    },
    removePatient: function (patientId) {
        // gửi request để xóa dữ liệu từ mockapi
        let removeUrl = `${this.baseApiUrl}/${patientId}`;
        fetch(removeUrl, { method: "DELETE" })
            .then(Response => Response.json())
            .then(data => {
                console.log(data);
                //xóa DOM trên trình duyệt
                document.querySelector(`#data-${data.id}`).remove();
            });
    },
}