const buttonsChangestatus = document.querySelectorAll('[button-change-status]');
if (buttonsChangestatus) {
    const formChangeStatus = document.querySelector('#form-change-status');
    const path = formChangeStatus.getAttribute('data-path');
    console.log(path);
    buttonsChangestatus.forEach(button => {
        button.addEventListener('click', () => {
            const statusCurrent = button.getAttribute('data-status');
            const id = button.getAttribute('data-id');
            let statusChange = statusCurrent == "active" ? "inactive" : "active";
            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            console.log(action);
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });

}