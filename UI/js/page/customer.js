$(document).ready(function () {
    setEvent();
    loadData(1);
})


function setEvent() {
    // Gán sự kiện cho button Add:
    $("#btnAdd").click(function () {
        // Hiển thị form thêm mới:
        $('#dlgCustomerDetail').removeClass('dialog-hide');
    })  

    $('.dialog-close-button').click(function () {
        $('#dlgCustomerDetail').addClass('dialog-hide');
    })


    $(document).on('dblclick', '#tblListCustomer tbody tr', function () {
        $('#dlgCustomerDetail').removeClass('dialog-hide');
        var recordId = $(this).data('recordId');
        $.ajax({
            method: "GET",
            url: `http://api.manhnv.net/api/customers/${recordId}`,
            async: false,
        }).done(function (response) {
            var customer = response;
            console.log(customer);
            var dateOfBirth = new Date(customer.DateOfBirth);
            $("#txtCustomerCode").val(customer.CustomerCode);
            $("#txtFullName").val(customer.FullName);
            $("#dtDateOfBirth").val(dateOfBirth);
            $("#txtPhoneNumber").val(customer.PhoneNumber);
            $("#txtEmail").val(customer.Email);
            $("#cbGender").val(customer.Gender);
            $("#cbCustomerGroup").val(customer.CustomerGroupId);
        }).fail(function (response) {
            console.log(response);
        })
        // binding dữ liệu thông tin khách hàng:
    });


    $(document).on('click', '#btnSave', function () {
        // Thu thập các thông tin của khách hàng đã nhập liệu:
        debugger
        var customerCode = $('#txtCustomerCode').val();
        var fullName = document.getElementById("txtFullName").value;
        var newCustomer = {
            "CustomerCode": customerCode,
            "FullName": fullName,
            "Gender": 0,
            "Address": "Cantho3",
            "Email": "ab9@gmail.com",
            "PhoneNumber": "911111119",
            "MemberCardCode": "fsdafasdfdsa",
            "CompanyName": "Mía2",
            "CustomerGroupName": "Nhóm khách hàng MISA",
            "GenderName": "Không xác định",
            "MISAEntityState": 0
        }
        // Gọi service để lưu lại:
        $.ajax({
            method: "POST",
            url: "http://api.manhnv.net/api/customers",
            data: JSON.stringify(newCustomer),
            async: false,
            contentType: "application/json"
        }).done(function (response) {
            alert('thêm thành công!');
        }).fail(function (response) {
            alert('Không thêm được!');
        })
    });

}

/**
 * Load dữ liệu khách hàng
 * */
function loadData() {

    // lấy dữ liệu từ Api về;
    var data = getData();
    console.table(data);
    buildDataTableHTML(data);
}

/**
 * Hàm thực hiện lấy dữ liệu
 * */
function getData() {
    var customers = null;
    $.ajax({
        method: "GET",
        url: "http://api.manhnv.net/api/customers",
        data: null,
        async: false,
        contentType: "application/json"
    }).done(function (response) {
        customers = response;
    }).fail(function (response) {
        alert("Không thể lấy dữ liệu từ Api");
    })
    return customers;
}

/**
 * Thực hiện build bảng dữ liệu tương ứng với dữ liệu lấy từ Api
 * @param {Array} data mảng dữ liệu
 * CreatedBy: NVMANH (17/03/2021)
 */
function buildDataTableHTML(data) {
    //$('table#tblListCustomer tbody').html('');
    $.each(data, function (index, customer) {
        var dateOfBirth = customer.DateOfBirth;
        debugger;
        var dateFormat = formatDateDDMMYYYY(dateOfBirth);
        // Xử lý dữ liệu ngày tháng (Hiển thị dạng ngày/tháng/năm - nếu có):
        var debitAmout = Math.floor(Math.random() * 100000000);
        var moneyFormat = formatMoney(debitAmout);
        var trHTML = $(`<tr>
                        <td>${customer.CustomerCode}</td>
                        <td>${customer.FullName}</td>
                        <td>${customer.GenderName}</td>
                        <td>${dateFormat}</td>
                        <td>${customer.CustomerGroupName}</td>
                        <td>${customer.PhoneNumber}</td>
                        <td>${customer.Email}</td>
                        <td class="text-align-right">${moneyFormat}</td>
                        <td class="text-align-center"><input type="checkbox" checked/></td>
                    </tr>`);
                    trHTML.data('recordId',customer.CustomerId);
        $('table#tblListCustomer tbody').append(trHTML);
    })
}


/**
 * Xử lý khi truyền ngày tháng vào sẽ trả về chuỗi string có dạng ngày/tháng/năm
 * @param {Date} date mảng dữ liệu
 * CreatedBy: NVMANH (17/03/2021)
 */
function formatDateDDMMYYYY(date) {
    if (!date) {
        return "";
    }
    var newDate = new Date(date);
    var dateString = newDate.getDate();
    var monthString = newDate.getMonth() + 1;
    var year = newDate.getFullYear();
    return `${dateString}/${monthString}/${year}`;
}


/**
 * Xử lý hiển thị tiền tệ - cách 1
 * @param {Number} money Số tiền dạng decimal
 * CreatedBy: NVMANH (17/03/2021)
 */
function formatMoney(money) {
    var moneyFormat = money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " VND";;
    return moneyFormat;
}

/**
 * Xử lý hiển thị tiền tệ - cách 2
 * @param {Number} money Số tiền dạng decimal
 * CreatedBy: NVMANH (17/03/2021)
 */
function formatMoney(money) {
    const formatter = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0
    })
    if (money) {
        return formatter.format(money) // "$1,000.00"
    }
    return "";
}
