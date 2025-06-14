/* 
    UserScript UI
    -- made by CCN0 -- https://ccn0.net/pages/usui -- https://github.com/ccn0/usui/ --
*/

const USUI = {
    version: "0.002beta",
    popups: [],
    defaultpos: ["0","0"],
    closeMenu: function (menuid) {
        USUI.popups.forEach(popup => {if (popup == menuid) {popup.remove()}});
        USUI.popups = USUI.popups.filter(item => item !== menuid);
    },
    closeAll: ()=>{
        USUI.popups.forEach(popup => popup.remove());
        USUI.popups = [];
    },
    createPopup: (params = {
        stay: false,
        position: USUI.defaultpos,
    }) => {
        if (USUI.popupOpen) {
            USUI.closeMenu();
        }
        USUI.popupOpen = true;

        const popupContainer = document.createElement("div");
        popupContainer.classList.add("USUI_popup");
        popupContainer.id = params.id ?? "unknownPopup";
        if (params.stay) {
            popupContainer.style.left = USUI.position[0];
            popupContainer.style.top = USUI.position[1];
        } else {
            USUI.position = params.position;
        };

        const popupTitlebar = document.createElement("div");
        popupTitlebar.classList.add("USUI_popuptitlebar");

        params.buttons.forEach((button) => {
            const tbBtn = document.createElement("button");
            tbBtn.classList.add("USUI_button", "USUI_titlebarbutton");
            tbBtn.textContent = button.textContent;
            tbBtn.title = button.title;
            if (button.id) {
                tbBtn.id = button.id;
            };
            if (button.classes) {
                tbBtn.classList.add(...button.classes);
            };
            tbBtn.addEventListener("click", button.event);
            tbBtn.addEventListener("mousedown", (event) => {
                event.stopPropagation();
            });
            popupTitlebar.appendChild(tbBtn);
        });

        const Titlespan = document.createElement("span");
        Titlespan.textContent = params.title;
        Titlespan.classList.add("USUI_titlespan");

        let isDragging = false;
        let initialX;
        let initialY;

        popupTitlebar.addEventListener("mousedown", (event) => {
            isDragging = true;
            initialX = event.clientX;
            initialY = event.clientY;
        });

        popupTitlebar.addEventListener("touchstart", (event) => {
            isDragging = true;
            initialX = event.touches[0].clientX;
            initialY = event.touches[0].clientY;
        });

        document.addEventListener("mousemove", (event) => {
            if (isDragging) {
                const dx = event.clientX - initialX;
                const dy = event.clientY - initialY;
                if (params.fencing) {
                    const rect = popupContainer.getBoundingClientRect();
                    let newLeft = popupContainer.offsetLeft + dx;
                    let newTop = popupContainer.offsetTop + dy;
                    const maxLeft = window.innerWidth - rect.width;
                    const maxTop = window.innerHeight - rect.height;

                    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                    newTop = Math.max(0, Math.min(newTop, maxTop));

                    USUI.position[0] = `${newLeft}px`;
                    USUI.position[1] = `${newTop}px`;
                } else {
                    USUI.position[0] = `${popupContainer.offsetLeft + dx}px`;
                    USUI.position[1] = `${popupContainer.offsetTop + dy}px`;
                }
                popupContainer.style.left = USUI.position[0];
                popupContainer.style.top = USUI.position[1];
                initialX = event.clientX;
                initialY = event.clientY;
            }
        });

        document.addEventListener("touchmove", (event) => {
            if (isDragging) {
                const dx = event.touches[0].clientX - initialX;
                const dy = event.touches[0].clientY - initialY;
                if (params.fencing) {
                    const rect = popupContainer.getBoundingClientRect();
                    let newLeft = popupContainer.offsetLeft + dx;
                    let newTop = popupContainer.offsetTop + dy;
                    const maxLeft = window.innerWidth - rect.width;
                    const maxTop = window.innerHeight - rect.height;

                    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                    newTop = Math.max(0, Math.min(newTop, maxTop));

                    USUI.position[0] = `${newLeft}px`;
                    USUI.position[1] = `${newTop}px`;
                } else {
                    USUI.position[0] = `${popupContainer.offsetLeft + dx}px`;
                    USUI.position[1] = `${popupContainer.offsetTop + dy}px`;
                }
                popupContainer.style.left = USUI.position[0];
                popupContainer.style.top = USUI.position[1];
                initialX = event.touches[0].clientX;
                initialY = event.touches[0].clientY;
            };
        }, { passive: false });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        document.addEventListener("touchend", () => {
            isDragging = false;
        });

        popupTitlebar.appendChild(Titlespan);
        popupContainer.appendChild(popupTitlebar);
        USUI.popups.push(popupContainer);
        return popupContainer;
    },
};