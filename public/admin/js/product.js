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
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });

}

const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector('#form-delete-item');
    const path = formDeleteItem.getAttribute('data-path');
    buttonsDelete.forEach(button => {
        button.addEventListener('click', () => {
            const isCofirm = confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
            if (isCofirm) {
                const id = button.getAttribute('data-id');
                const action = path + `/${id}?_method=DELETE`;
                formDeleteItem.action = action;
                formDeleteItem.submit();

            }
        });
    });
}