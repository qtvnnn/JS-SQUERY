$(document).ready(function () {
    loadData();
    eventPage();
});

/**
 * Load dữ liệu
 * CreatedBy: NNNANG (14/04/2021)
 */
function loadData() {
    $('tbody').empty();
    //Lấy dữ liệu từ api
    $.ajax({
        url: "http://api.manhnv.net/v1/Employees",
        method: "GET",
    }).done(function (response) {
        response.forEach(function (item) {
            var trHTML = `<tr>
                        <input type="hidden" class="employeeId" value="${item.EmployeeId}">
                        <td class="EmployeeCode">${item.EmployeeCode}</td>
                        <td class="fullName">${item.FullName}</td>
                        <td class="genderName">${!item.GenderName?'Không xác định':item.GenderName}</td>
                        <td class="dateOfBirth">${formatDate(item.DateOfBirth)}</td>
                        <td class="phoneNumber">${item.PhoneNumber}</td>
                        <td class="email">${item.Email}</td>
                        <td class="positionName">${item.PositionName}</td>
                        <td class="departmentName">${item.DepartmentName}</td>
                        <td class="text-align-right salary">${formatSalary(item.Salary)}</td>
                        <td class="workStatus">${getWorkStatusName(item.WorkStatus)}</td>
                    </tr > `;
            $('tbody').append(trHTML);
        })
        console.log(response);
    }).fail(function (response) {
        console.log(response);
    })
}

function formatDate(dateString) {
    if (dateString !== null) {
        var res = dateString.split("-");
        var year = res[0];
        var month = res[1];
        var day = res[2].split("T")[0];
        return day + "/" + month + "/" + year;
    }
    return "";
}

function formatSalary(salary) {
    if (salary !== null) {
        return salary.toLocaleString('vi-VN');
    }
    return "";
}

function formatDateToForm(dateString) {
    if (dateString !== null) {
        var res = dateString.split("-");
        var year = res[0];
        var month = res[1];
        var day = res[2].split("T")[0];
        return year + "-" + month + "-" + day;
    }
    return "";
}

function getWorkStatusName(statusName) {
    switch (statusName) {
        case 0:
            return "Đã nghỉ việc";
            break;
        case 1 || "1":
            return "Thực tập sinh";
            break;
        case 2 || "2":
            return "Thử việc";
            break;
        case 3 || "3":
            return "Chính thức";
            break;
        default:
            return "";
    }
}

function getGenderName(gender) {
    switch (gender) {
        case "0" || 0:
            return "Nữ";
            break;
        case "1" || 1:
            return "Nam";
            break;
        default:
            return "";
    }
}

function getPositionName(position) {
    switch (position) {
        case "3700cc49-55b5-69ea-4929-a2925c0f334d":
            return "Giám đốc";
            break;
        case "25c6c36e-1668-7d10-6e09-bf1378b8dc91":
            return "Thu ngân";
            break;
        case "148ed882-32b8-218e-9c20-39c2f00615e8":
            return "Nhân viên Marketting";
            break;
        default:
            return "";
    }
}

function getDepartmentName(department) {
    switch (department) {
        case "469b3ece-744a-45d5-957d-e8c757976496":
            return "Phòng nhân sự";
            break;
        case "142cb08f-7c31-21fa-8e90-67245e8b283e":
            return "Phòng Marketting";
            break;
        case "17120d02-6ab5-3e43-18cb-66948daf6128":
            return "Phòng đào tạo";
            break;
        case "4e272fc4-7875-78d6-7d32-6a1673ffca7c":
            return "Phòng Công nghệ";
            break;
        default:
            return "";
    }
}

function cleanInput() {
    $('#txtCustomerCode').val('');
    $('#txtFullName').val('');
    $('#txtPhoneNumber').val('');
    $('#txtEmail').val('');
    $('#txtSalary').val('');
}

function validateForm() {
    $('#txtCustomerCode').blur(function () {
        if (!$(this).val()) {
            $(this).addClass('input-warning');
            alert("Mã nhân viên không thể để trống!");
        } else {
            $(this).removeClass('input-warning');
        }
    });

    $('#txtFullName').blur(function () {
        if (!$(this).val()) {
            $(this).addClass('input-warning');
            alert("Họ tên không thể để trống!");
        } else {
            $(this).removeClass('input-warning');
        }
    });

    $('#txtPhoneNumber').blur(function () {
        if (!$(this).val()) {
            $(this).addClass('input-warning');
            alert("Số điện thoại không thể để trống!");
        } else {
            $(this).removeClass('input-warning');
        }
    });

    $('#txtEmail').blur(function () {
        if (!$(this).val()) {
            $(this).addClass('input-warning');
            alert("Email không thể để trống!");
        } else {
            $(this).removeClass('input-warning');
        }
    });
}


function eventPage() {
    validateForm();

    $('.dialog-close-button').click(function () {
        $('#dlgCustomerDetail').addClass('dialog-hide');
    });

    $('.btn-add-employee').click(function () {
        $('#dlgCustomerDetail').removeClass('dialog-hide');
        $('#btnDelete').hide();
        cleanInput();
        $('#typeRequest').val(0);
    });

    $(document).on('click', 'tr', function () {
        let employeeId = $(this).find('.employeeId').val();
        $('#btnDelete').show();
        $('#typeRequest').val(1);
        $.ajax({
            url: `http://api.manhnv.net/v1/Employees/${employeeId}`,
            method: "GET",
            async: false,
        }).done(function (response) {
            console.log(response);
            $('#employeeId').val(response.EmployeeId);
            $('#txtCustomerCode').val(response.EmployeeCode);
            $('#txtFullName').val(response.FullName);
            $('#cbGender').val(response.Gender);
            $('#dtDateOfBirth').val(formatDateToForm(response.DateOfBirth));
            $('#txtPhoneNumber').val(response.PhoneNumber);
            $('#txtEmail').val(response.Email);
            $('#txtPositionName').val(response.PositionId);
            $('#txtDepartmentName').val(response.DepartmentId);
            $('#txtSalary').val(response.Salary);
            $('#cbWorkStatus').val(response.WorkStatus);
        }).fail(function (response) {
            console.log(response);
        });
        $('#dlgCustomerDetail').removeClass('dialog-hide');
    });

    $(document).on('click', '#btnSave', function () {
        if ($(this).parent().parent().find('.input-warning').length > 0) {            
            alert("Vui lòng điền hết thông tin!");
        } else {
            let typeRequest = $('#typeRequest').val();
            console.log(typeRequest);
            let employeeId = $(this).parent().find('#employeeId').val();
            let customer = {
                "EmployeeCode": $('#txtCustomerCode').val(),
                "FullName": $('#txtFullName').val(),
                "Gender": $('#cbGender').val(),
                "GenderName": getGenderName($('#cbGender').val()),
                "DateOfBirth": "1970-01-01T00:00:41",
                "PhoneNumber": $('#txtPhoneNumber').val(),
                "Email": $('#txtEmail').val(),
                "PositionId": $('#txtPositionName').val(),
                "PositionName": getPositionName($('#txtPositionName').val()),
                "DepartmentId": $('#txtDepartmentName').val(),
                "DepartmentName": getDepartmentName($('#txtDepartmentName').val()),
                "Salary": $('#txtSalary').val(),
                "WorkStatus": $('#cbWorkStatus').val()
            }
            console.log(customer);
            if (typeRequest == 1) {
                $.ajax({
                    url: `http://api.manhnv.net/v1/Employees/${employeeId}`,
                    method: "PUT",
                    data: JSON.stringify(customer),
                    contentType: "application/json"
                }).done(function (response) {
                    console.log(response);
                    alert("Cập nhật thành công");
                    $('#dlgCustomerDetail').addClass('dialog-hide');
                    loadData();

                }).fail(function (response) {
                    console.log(response);
                });
            } else {
                $.ajax({
                    url: "http://api.manhnv.net/v1/Employees",
                    method: "POST",
                    data: JSON.stringify(customer),
                    contentType: "application/json"
                }).done(function (response) {
                    alert('thêm thành công!');
                    $('#dlgCustomerDetail').addClass('dialog-hide');
                    loadData();
                }).fail(function (response) {
                    console.log(response);
                })
            }
        }
    });


    $(document).on('click', '#btnDelete', function () {
        let employeeId = $(this).parent().find('#employeeId').val();
        $.ajax({
            url: `http://api.manhnv.net/v1/Employees/${employeeId}`,
            method: "DELETE",
            dataType: 'json',
            contentType: "application/json",
        }).done(function (response) {
            $('#dlgCustomerDetail').addClass('dialog-hide');
            console.log(response);
            // alert("Xóa thành công");
            loadData();
        }).fail(function (response) {
            console.log(response);
        });
    });
}