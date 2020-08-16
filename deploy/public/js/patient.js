const urlParams = new URLSearchParams(window.location.search);
const hospitalId = urlParams.get('id');
let patientUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}/patients`;
let hospitalUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${hospitalId}`;
let allHospitalApiUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/`;
axios.get(hospitalUrl)
    .then(response => {
        document.querySelector('h1').innerHTML = response.data.name;
    })
    .then(() => {
        axios.get(patientUrl)
            .then(response => {
                if (response.data.length > 0) {
                    let content = ``;
                    response.data.   map(item => {
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
                max: 100
            },
            bed_no: {
                required: true,
                number: true,
                min: 1,
                max:1000
            },
            description: {
                required: true,
                maxlength:255
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
                min: "Yêu cầu nhập số không có số âm",
                max:"không nhập quá 1000"
            },
            description: {
                required: "Yêu cầu nhập mô tả",
                maxlength:"không quá 255 kí tự"
            }
        }
    });
    if ($("#Add").valid()) {
        let customHospitalId = document.querySelector('#hospitalSelector').value;
        let customPatientUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${customHospitalId}/patients`;
        if (customHospitalId == hospitalId) {
            axios.post(customPatientUrl, data)
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
        } else {
            axios.post(customPatientUrl, data)
                .then(() => {
                    $("#exampleModal").modal('hide');
                })
        }
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
                max: 100
            },
            bed_noEdit: {
                required: true,
                number: true,
                min: 0,
                max:1000
            },
            descriptionEdit: {
                required: true,
                maxlength:255
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
                min: "Yêu cầu nhập số không có số âm",
                max:"không nhập quá 1000"
            },
            descriptionEdit: {
                required: "Yêu cầu nhập mô tả",
                maxlength:"không quá 255 kí tự"
            }
        }
    });
    if ($("#Edit").valid()) {
        let customHospitalId = document.querySelector("#hospitalSelectorEdit").value;
        let customPatientUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${customHospitalId}/patients/${patientId}`;
        let postCustomPatientUrl = `https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/${customHospitalId}/patients`;
        if (customHospitalId == hospitalId) {
            axios.put(customPatientUrl, data)
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
                });
        } else {
            axios.post(postCustomPatientUrl, data)
                .then(() => {
                    axios.delete(customPatientUrl)
                        .then(response => {
                            document.querySelector(`#data-${response.data.id}`).remove();
                            $("#exampleModalEdit").modal('hide');
                        })
                })
        }

    }

}
window.onload = start;
function start() {
    this.hospitalChoices();
}
function hospitalChoices() {
    axios.get(allHospitalApiUrl)
        .then(response => {
            if (response.data.length > 0) {
                let hospitalName = ``;
                response.data.map(item => {
                    if (item.id == hospitalId) {
                        hospitalName += `<option value="${item.id}" selected>${item.name}</option>`
                    }
                    if (item.id != hospitalId) {
                        hospitalName += `<option value="${item.id}">${item.name}</option>`
                    }
                });
                document.querySelector("#hospitalSelector").innerHTML = hospitalName;
                document.querySelector("#hospitalSelectorEdit").innerHTML = hospitalName;
            }
        })
}