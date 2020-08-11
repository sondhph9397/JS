const urlParams = new URLSearchParams(window.location.search);
const hospitalId = urlParams.get('id');
let patientUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}/patients`;
let hospitalUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}`;
axios.get(hospitalUrl)
.then(response => {
    document.querySelector('h1').innerHTML = response.data.name;
})
.then(() =>{
    axios.get(patientUrl)
    .then(response => {
        if (response.data.length > 0) {
            let content = ``;
            response.data.map(item => {
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
})

function removePatient(patientId) {
    let removeUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}/patients/${patientId}`;
    swal.fire({
        title: "Bạn có chắc chắn xóa không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Hủy bỏ",
        confirmButtonText: "Xóa",
    })
        .then(confirm => {
            if (confirm.value) {
                axios.delete(removeUrl)
                    .then(response => {
                        document.querySelector(`#data-${response.data.id}`).remove()
                    })
            }
        })
}
function addPatient() {
    let data = {
        name: document.querySelector('[name="name"]').value,
        age: document.querySelector('[name="age"]').value,
        bed_no: document.querySelector('[name="bed_no"]').value,
        description: document.querySelector('[name="description"]').value
    };
    $("#Add").validate({
        rules: {
            name: {
                required: true,
                maxlength: 50
            },
            age: {
                required: true,
                number: true,
                min: 1,
                max:100
            },
            bed_no: {
                required: true,
                number: true,
                min: 1,
            },
            description: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Yêu cầu nhập tên bệnh nhân",
                maxlength: "Yêu cầu nhập tên dưới 50 ký tự"
            },
            age: {
                required: "Yêu cầu nhập tuổi bệnh nhân",
                number: "Tuổi bệnh nhân phải là số",
                min: "Tuổi bệnh nhân phải lớn hơn 0",
                max: "Tuổi không được quá 100"
            },
            bed_no: {
                required: "Yêu cầu nhập số giường của bệnh nhân",
                number: "Yêu cầu giá trị nhập vào là số",
                min: "Yêu cầu nhập số không có số âm"
            },
            description: {
                required: "Yêu cầu nhập mô tả"
            }
        }
    });
    if ($("#Add").valid()) {
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

}
function editPatient(patientId) {
    let editUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}/patients/${patientId}`;
    axios.get(editUrl)
        .then(response => {
            document.querySelector('[name="nameEdit"]').value = response.data.name;
            document.querySelector('[name="ageEdit"]').value = response.data.age;
            document.querySelector('[name="bed_noEdit"]').value = response.data.bed_no;
            document.querySelector('[name="descriptionEdit"]').value = response.data.description;
            document.querySelector('.btn-save-edit').setAttribute("onclick", `saveEditPatient(${response.data.id})`);
        })
}
function saveEditPatient(patientId) {
    let data = {
        name: document.querySelector('[name="nameEdit"]').value,
        age: document.querySelector('[name="ageEdit"]').value,
        bed_no: document.querySelector('[name="bed_noEdit"]').value,
        description: document.querySelector('[name="descriptionEdit"]').value
    };
    let saveEditUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}/patients/${patientId}`;
    $("#Edit").validate({
        rules: {
            nameEdit: {
                required: true,
                maxlength: 50
            },
            ageEdit: {
                required: true,
                number: true,
                min: 1,
                max:100
            },
            bed_noEdit: {
                required: true,
                number: true,
                min: 0
            },
            descriptionEdit: {
                required: true
            }
        },
        messages: {
            nameEdit: {
                required: "Yêu cầu nhập tên bệnh nhân",
                maxlength: "Yêu cầu nhập tên dưới 50 ký tự"
            },
            ageEdit: {
                required: "Yêu cầu nhập tuổi bệnh nhân",
                number: "Tuổi bệnh nhân phải là số",
                min: "Tuổi bệnh nhân phải lớn hơn 0",
                max: "Tuổi không được quá 100"
            },
            bed_noEdit: {
                required: "Yêu cầu nhập số giường của bệnh nhân",
                number: "Yêu cầu giá trị nhập vào là số",
                min: "Yêu cầu nhập số không có số âm"
            },
            descriptionEdit: {
                required: "Yêu cầu nhập mô tả"
            }
        }
    });
    if ($("#Edit").valid()) {
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

}