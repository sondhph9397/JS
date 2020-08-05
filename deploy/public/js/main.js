window.SystemCore = {
    baseApiUrl: 'https://5f2a96d76ae5cc0016422bab.mockapi.io/hospitals',
    fetchData: function () {
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
                        <td>${item.name}</td>
                        <td><img src="${item.logo}" width="100"></td>
                        <td>${item.address}</td>
                        <td>${item.bed_number}</td>
                       <td><button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
                       data-dismiss="modal" onclick="SystemCore.editHospital(${item.id})">
                           Sửa
                       </button></td>
                       <td><button type="button" class="btn btn-danger" onclick="SystemCore.removeHospital(${item.id})">Xóa</button></td>
                    </tr>`;
                    });
                    document.querySelector('tbody').innerHTML = content;
                }
            })
    },
    addHospital: function () {
        let data = {
            name: document.querySelector('[name="name"]').value,
            logo: document.querySelector('[name="logo"]').value,
            address: document.querySelector('[name="address"]').value,
            bed_number: document.querySelector('[name="bed_number"]').value,
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
                let newRow = `<tr id="data-${item.id}">
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td><img src="${item.logo}" width="100"/></td>
            <td>${item.address}</td>
            <td>${item.bed_number}</td>
            <td><button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
            data-dismiss="modal" onclick="SystemCore.editHopital(${item.id})">
                Sửa
            </button></td>
            <td><button type="button" class="btn btn-danger" onclick="SystemCore.removeHopital(${item.id})">Xóa</button></td>
        </tr>`;
                let content = document.querySelector('tbody').innerHTML;
                content += newRow;
                document.querySelector('tbody').innerHTML = content;
            })
            .then(() => {
                $("exampleModal").modal('hide');
            })
    },
    editHospital: function (hospitalId) {
        let editUrl = `${this.baseApiUrl}/${hospitalId}`;
        fetch(editUrl)
            .then(response => response.json())
            .then(data => {
                document.querySelector('[name="nameEdit"]').value = data.name;
                document.querySelector('[name="logoEdit"]').value = data.logo;
                document.querySelector('[name="addressEdit"]').value = data.address;
                document.querySelector('[name="bed_numberEdit"]').value = data.bed_number;
                document.querySelector('.btn-save-edit').setAttribute("onclick", `SystemCore.saveEditHospital(${data.id})`);
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
                                content += `<tr id="data-${item.id}">
                                    <td>${item.id}</td>
                                    <td>${item.name}</td>
                                    <td><img src="${item.logo}" width="100"/></td>
                                    <td>${item.address}</td>
                                    <td>${item.bed_number}</td>
                                    <td><button type="button" class="btn btn-primary btn-edit" data-toggle="modal" data-target="#exampleModalEdit" 
                                    data-dismiss="modal" onclick="SystemCore.editHospital(${item.id})">
                                        Sửa
                                    </button></td>
                                    <td><button type="button" class="btn btn-danger" onclick="SystemCore.removeHospital(${item.id})">Xóa</button></td>
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
    removeHospital: function (hospitalId) {
        // gửi request để xóa dữ liệu từ mockapi
        let removeUrl = `${this.baseApiUrl}/${hospitalId}`;
        fetch(removeUrl, { method: "DELETE" })
            .then(Response => Response.json())
            .then(data => {
                console.log(data);
                //xóa DOM trên trình duyệt
                document.querySelector(`#data-${data.id}`).remove();
            });
    },
}