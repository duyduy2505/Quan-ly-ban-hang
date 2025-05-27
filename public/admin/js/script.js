const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length >0 ){
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if(status){
                url.searchParams.set ("status", status);}
                else{
                    url.searchParams.delete("status");
                }
            window.location.href = url.href;    
        });
    });
}

const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        console.log(e.target.elements.keyword.value);
        if(keyword){
                url.searchParams.set ("keyword", keyword);}
                else{
                    url.searchParams.delete("keyword");
                }
            window.location.href = url.href;
    });
}

const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination){
    let url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;    
        });
    });
}

const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        console.log(inputCheckAll.checked);
        if(inputCheckAll.checked){
            inputsId.forEach(input => {
                input.checked = true;
            });
        }
        else{
            inputsId.forEach(input => {input.checked = false;});
        }
    });
        inputsId.forEach(input => {
            input.addEventListener("click", () => {
                const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
                if(countChecked == inputsId.length){
                    inputCheckAll.checked = true;
                }
                else{
                    inputCheckAll.checked = false;
                }   
            });
        });
}

const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        if(inputsChecked.length > 0){
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputsChecked.forEach(input => {
                const id = input.getAttribute("value");
                ids.push(id);
            });  
            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
        }
        else{
            alert("Vui long chon san pham can thay doi");
            return false;
        }
        
    });
}