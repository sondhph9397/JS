window.SystemCore = {
    baseApiUrl: 'https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals/',
    fetchData: function () {
        axios.get(this.baseApiUrl)
            .then(response => {
                if (response.data.length > 0) {
                    let content = ``;
                    response.data.map(item => {
                        content += `<tr id="data-${item.id}" >
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td><img src="${item.logo}" width="100"></td>
                        <td>${item.address}</td>
                        <td>${item.bed_number}</td>
                       <td><button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
                       data-dismiss="modal" onclick="SystemCore.editHospital(${item.id})">
                           Sửa
                       </button>
                       <button type="button" class="btn btn-danger" onclick="SystemCore.removeHospital(${item.id})">Xóa</button>
                       <a href="patient.html?id=${item.id}" class="btn btn-info">Xem</a></td>
                    </tr>`;
                    });
                    document.querySelector('tbody').innerHTML = content;
                }
            })
    },
    removeHospital: function (hospitalId) {
        let removeUrl = `${this.baseApiUrl}/${hospitalId}`;
        let allPatientUrl = `${this.baseApiUrl}/${hospitalId}/patients`;
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
                    axios.get(allPatientUrl)
                        .then(response => {
                            if (response.data.length > 0) {
                                response.data.map(item => {
                                    let eachPatientUrl = `${SystemCore.baseApiUrl}/${hospitalId}/patients/${item.id}`;
                                    axios.delete(eachPatientUrl)
                                })
                            }
                            axios.delete(removeUrl)
                                .then(response => {
                                    document.querySelector(`#data-${response.data.id}`).remove()
                                })
                        })
                }
            })
    },
    addHospital: function () {
        let baseApiUrl = this.baseApiUrl;
        let data = {
            name: document.querySelector('[name="name"]').value,
            logo: document.querySelector('[name="logo"]').value,
            address: document.querySelector('[name="address"]').value,
            bed_number: document.querySelector('[name="bed_number"]').value,
        };
        $("#add").validate({
            rules: {
                name: {
                    required: true,
                    maxlength: 50
                },
                logo: {
                    required: true,
                    url: true
                },
                address: {
                    required: true,
                    maxlength: 199
                },
                bed_number: {
                    required: true,
                    number: true,
                    min: 20
                }
            },
            messages: {
                name: {
                    required: "Yêu cầu nhập tên bệnh viện",
                    max: "Yêu cầu nhập tên dưới 50 ký tự"
                },
                logo: {
                    required: "Yêu cầu nhập ảnh bệnh viện",
                    url: "Yêu cầu nhập đúng đường dẫn ảnh"
                },
                address: {
                    required: "Yêu cầu nhập địa chỉ bệnh viện",
                    maxlength: "Yêu cầu nhập địa chỉ dưới 199 ký tự"
                },
                bed_number: {
                    required: "Yêu cầu nhập số giường bệnh viện",
                    number: "Yêu cầu giá trị nhập vào là số",
                    min: "Số giường phải lớn hơn hoặc bằng 20"
                }
            }
        });
        if ($("#add").valid()) {
            axios.post(baseApiUrl, data)
                .then(response => {
                    let newRow = `<tr id="data-${response.data.id}">
                    <td>${response.data.id}</td>
                    <td>${response.data.name}</td>
                    <td><img src="${response.data.logo}" width="100"/></td>
                    <td>${response.data.address}</td>
                    <td>${response.data.bed_number}</td>
                    <td><button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
                    data-dismiss="modal" onclick="SystemCore.editHopital(${response.data.id})">
                    Sửa
                    </button>
                    <button type="button" class="btn btn-danger" onclick="SystemCore.removeHospital(${response.data.id})">Xóa</button>
                    <a href="patient.html?id=${response.data.id}" class="btn btn-info">Xem</a></td>
                        </tr>`;
                    let content = document.querySelector('tbody').innerHTML;
                    content += newRow;
                    document.querySelector('tbody').innerHTML = content;
                })
                .then(() => {
                    $("exampleModal").modal('hide');
                })
        }

    },
    editHospital: function (hospitalId) {
        let editUrl = `${this.baseApiUrl}/${hospitalId}`;
        axios.get(editUrl)
            .then(response => {
                document.querySelector('[name="nameEdit"]').value = response.data.name;
                document.querySelector('[name="logoEdit"]').value = response.data.logo;
                document.querySelector('[name="addressEdit"]').value = response.data.address;
                document.querySelector('[name="bed_numberEdit"]').value = response.data.bed_number;
                document.querySelector('.btn-save-edit').setAttribute("onclick", `SystemCore.saveEditHospital(${response.data.id})`);
            })
    },
    saveEditHospital: function (hospitalId) {
        let editUrl = `${this.baseApiUrl}/${hospitalId}`;
        let data = {
            name: document.querySelector('[name="nameEdit"]').value,
            logo: document.querySelector('[name="logoEdit"]').value,
            address: document.querySelector('[name="addressEdit"]').value,
            bed_number: document.querySelector('[name="bed_numberEdit"]').value,
        };
        $("#Edit").validate({
            rules: {
                nameEdit: {
                    required: true,
                    maxlength: 50
                },
                logoEdit: {
                    required: true,
                    url: true
                },
                addressEdit: {
                    required: true,
                    maxlength: 199
                },
                bed_numberEdit: {
                    required: true,
                    number: true,
                    min: 20
                }
            },
            messages: {
                nameEdit: {
                    required: "Yêu cầu nhập tên bệnh viện",
                    max: "Yêu cầu nhập tên dưới 199 ký tự"
                },
                logoEdit: {
                    required: "Yêu cầu nhập ảnh bệnh viện",
                    url: "Yêu cầu nhập đúng đường dẫn ảnh"
                },
                addressEdit: {
                    required: "Yêu cầu nhập địa chỉ bệnh viện",
                    maxlength: "Yêu cầu nhập địa chỉ dưới 199 ký tự"
                },
                bedNumberEdit: {
                    required: "Yêu cầu nhập số giường bệnh viện",
                    number: "Yêu cầu giá trị nhập vào là số",
                    min: "Số giường phải lớn hơn hoặc bằng 20"
                }
            }
        });
        if ($("#Edit").valid()) {
            axios.put(editUrl, data)
                .then(() => {
                    axios.get(this.baseApiUrl)
                        .then(response => {
                            if (response.data.length > 0) {
                                let content = ``;
                                response.data.map(item => {
                                    content += `<tr id="data-${item.id}">
                                <td>${item.id}</td>
                                <td>${item.name}</td>
                                <td><img src="${item.logo}" width="100"/></td>
                                <td>${item.address}</td>
                                <td>${item.bed_number}</td>
                                <td><button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
                                data-dismiss="modal" onclick="SystemCore.editHospital(${item.id})">
                                    Sửa
                                </button>
                                <button type="button" class="btn btn-danger" onclick="SystemCore.removeHospital(${item.id})">Xóa</button>
                                <a href="patient.html?id=${item.id}" class="btn btn-info">Xem</a></td>
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
    },
}