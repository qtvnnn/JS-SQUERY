$(document).ready(function () {
    //thực hiện load dữ liệu
    loadData();
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
                        <td>${item.EmployeeId}</td>
                        <td>${item.FullName}</td>
                        <td>${item.GenderName}</td>
                        <td>${item.DateOfBirth}</td>
                        <td>${item.DepartmentName}</td>
                        <td>${item.PhoneNumber}</td>
                        <td>${item.Email}</td>
                        <td class="text-align-right">${item.Salary}</td>
                        <td class="text-align-center"><input type="checkbox" ${item.WorkStatus == 0 ? '' : 'checked'}></td>
                    </tr > `;
            $('tbody').append(trHTML);
        })
        console.table(response);

        for (let i = 0; i < 10; i++) {

        }
    }).fail(function (response) {
        console.log(response);
    })
    //build lên table




}