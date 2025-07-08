/* 
    UserScript UI
    -- made by CCN0 -- https://ccn0.net/pages/usui -- https://github.com/ccn0/usui/ --
*/

const USUI = {
    version: "0.006beta",
    popups: [],
    defaultpos: ["0","0"],
    position: ["0","0"],
    closeMenu: function (menuid) {
        USUI.popups.forEach(popup => {if (popup == menuid) {popup.remove()}});
        USUI.popups = USUI.popups.filter(item => item !== menuid);
    },
    closeAll: ()=>{
        USUI.popups.forEach(popup => popup.remove());
        USUI.popups = [];
    },
    createPopup: (params = {
        id: "unknownPopup",
        stay: false,
        position: USUI.defaultpos || ["0","0"],
        buttons: [],
        title: "Popup",
        fencing: false,
    }) => {
        const popupContainer = document.createElement("div");
        popupContainer.classList.add("USUI_popup");
        popupContainer.id = params.id ?? "unknownPopup";
        if (params.stay) {
            popupContainer.style.left = USUI.position[0];
            popupContainer.style.top = USUI.position[1];
        } else {
            USUI.position = params.position ?? USUI.defaultpos;
            popupContainer.style.left = USUI.position[0];
            popupContainer.style.top = USUI.position[1];
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

        popupTitlebar.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            initialX = e.clientX;
            initialY = e.clientY;
        });

        popupTitlebar.addEventListener("touchstart", (e) => {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            initialX = e.touches[0].clientX;
            initialY = e.touches[0].clientY;
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                const dx = e.clientX - initialX;
                const dy = e.clientY - initialY;
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
                initialX = e.clientX;
                initialY = e.clientY;
            }
        });

        document.addEventListener("touchmove", (e) => {
            if (isDragging) {
                const dx = e.touches[0].clientX - initialX;
                const dy = e.touches[0].clientY - initialY;
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
                initialX = e.touches[0].clientX;
                initialY = e.touches[0].clientY;
            }
        }, { passive: false });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        document.addEventListener("touchend", () => {
            isDragging = false;
        });

        popupTitlebar.appendChild(Titlespan);
        popupContainer.appendChild(popupTitlebar);
        USUI.popups.push(popupContainer)
        return popupContainer;
    },
};