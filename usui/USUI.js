/* 
    UserScript UI
    -- made by CCN0 -- https://usui.qog.app/ -- https://github.com/ccn0/usui/ --
*/

const USUI = {
    version: "0.019beta",
    popups: [],
    defaultpos: ["0","0"],
    __position__: ["0","0"],
    spawnCSS: (params={
        overwrite:false,
        host:"https://usui.qog.app/lib/USUI.css",
    })=>{
        const href = params.host || "https://usui.qog.app/lib/USUI.css";
        if (params.overwrite || !document.querySelector(`link[href="${href}"]`)) {
            const usuiCSS = document.createElement("link");
            usuiCSS.rel = "stylesheet";
            usuiCSS.href = href;
            document.head.appendChild(usuiCSS);
        };
    },
    closeMenu: (menu)=>{
        USUI.popups.forEach(popup => {if (popup == menu) {popup.remove()}});
        USUI.popups = USUI.popups.filter(item => item !== menu);
    },
    closeAll: ()=>{
        USUI.popups.forEach(popup => popup.remove());
        USUI.popups = [];
    },
    lib: {
        round: (num, digits) => {
            return Number(num.toFixed(digits));
        },
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
            popupContainer.style.left = params.position[0];
            popupContainer.style.top = params.position[1];
            USUI.position = [params.position[0], params.position[1]];
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
                e.preventDefault();
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
    modules: {
        iRGB: (params = {
            value: "#000000",
            red: 0,
            green: 0,
            blue: 0,
        })=>{
            let values = [];
            function defValues(hex) {
                if (hex.length == 7) {
                    let temp = hex?.slice(1).match(/.{1,2}/g);
                    values = [Number("0x"+temp[0]),Number("0x"+temp[1]),Number("0x"+temp[2])];
                };
                if (hex.length == 4) {
                    let temp = hex?.slice(1).split("");
                    values = [Number("0x"+temp[0]+temp[0]),Number("0x"+temp[1]+temp[1]),Number("0x"+temp[2]+temp[2])];
                };
            };
            if (params.value) {
                let temp = params.value?.slice(1).match(/.{1,2}/g) || [params.red, params.green, params.blue];
                values = [Number("0x"+temp[0]),Number("0x"+temp[1]),Number("0x"+temp[2])];
            } else {
                values = [params.red, params.green, params.blue];
            };

            function computeHex() {
                let hexCode = "#";
                hexCode += values[0].toString(16).padStart(2,"0");
                hexCode += values[1].toString(16).padStart(2,"0");
                hexCode += values[2].toString(16).padStart(2,"0");
                return hexCode;
            };
            const colorInput = document.createElement("div");
            colorInput.classList.add("USUI_M_colorInput");
            colorInput.tabIndex = "0";

            const colorChip = document.createElement("div");
            colorChip.classList.add("USUI_M_colorInput_chip");
            if (params.value) {
                colorChip.style.cssText = `background-color:${params.value};`;
                colorInput.dataset.value = params.value;
            };
            if (params.red > 0 || params.green > 0 || params.blue > 0) {
                colorChip.style.cssText = `background-color:${computeHex()};`;
                colorInput.dataset.value = computeHex();
            };
            if (params.red > 255 || params.green > 255 || params.blue > 255) {
                console.error("RGB values must be between 0 and 255");
                return;
            };

            function colorPrompt(e) {
                document.querySelectorAll(".USUI_M_prompt").forEach(el=>el.remove());
                const prompt = document.createElement("div");
                prompt.classList.add("USUI_M_prompt");
                prompt.style.backgroundColor = computeHex();
                prompt.style.borderColor = computeHex();

                const hexInput = document.createElement("input");
                hexInput.classList.add("USUI_M_colorInput_iText")
                hexInput.type = "text";
                hexInput.title = "Insert Hex Color Code";
                hexInput.value = computeHex();
                hexInput.placeholder = "#abcdef";
                hexInput.maxLength = "7";
                function createSlider(index, params = {
                    title: "Color"
                }) {
                    const slider = document.createElement("input");
                    slider.title = params.title;
                    slider.type = "range";
                    slider.min = "0";
                    slider.max = "255";
                    slider.value = values[index];
                    slider.classList.add("USUI_M_colorInput_slider", `USUI_M_colorInput_slider${index}`);
                    slider.addEventListener("input",(e)=>{
                        values[index] = Number(e.target.value);
                        updateColor();
                    });
                    slider.addEventListener("change",(e)=>{
                        values[index] = Number(e.target.value);
                        updateColor();
                    });

                    prompt.appendChild(slider);
                    return slider;
                };

                const sliderR = createSlider(0, {title: "Red"});
                const sliderG = createSlider(1, {title: "Green"});
                const sliderB = createSlider(2, {title: "Blue"});

                hexInput.addEventListener("input",(e)=>{
                    if (e.target.value.match(/[^0-9a-fA-F#]/g)) return;
                    defValues(e.target.value);
                    sliderR.value = values[0];
                    sliderG.value = values[1];
                    sliderB.value = values[2];
                    updateColor({dontupdate:["hexinput"]});
                });
                hexInput.addEventListener("change",(e)=>{
                    if (e.target.value.match(/[^0-9a-fA-F#]/g)) return;
                    defValues(e.target.value);
                    sliderR.value = values[0];
                    sliderG.value = values[1];
                    sliderB.value = values[2];
                    updateColor({dontupdate:["hexinput"]});
                });
                prompt.appendChild(hexInput);
                function updateColor(params = {dontupdate:[]}) {
                    const hex = computeHex();
                    colorChip.style.backgroundColor = hex;
                    colorInput.dataset.value = hex;
                    if (!params.dontupdate.includes("hexinput")) hexInput.value = hex;
                    prompt.style.backgroundColor = computeHex();
                    prompt.style.borderColor = computeHex();

                    const inputEvent = new Event("input", { bubbles: true });
                    const changeEvent = new Event("change", { bubbles: true });

                    colorInput.dispatchEvent(inputEvent);
                    colorInput.dispatchEvent(changeEvent);
                };

                document.body.appendChild(prompt);
                sliderR.focus();
                
                function handleClickOutside(ev) {
                    if (!prompt.contains(ev.target)) {
                        prompt.remove();
                        document.removeEventListener("click", handleClickOutside);
                    }
                };
                setTimeout(() => {
                    document.addEventListener("click", handleClickOutside);
                }, 0);
                prompt.addEventListener("keydown", (e)=>{
                    if (e.key == "Escape") {
                        prompt.remove();
                        colorInput.focus();
                    };
                });

                const promptRect = prompt.getBoundingClientRect();
                let top = e.clientY;
                let left = e.clientX;

                if (top + promptRect.height > window.innerHeight) {
                    top = window.innerHeight - promptRect.height;
                };
                if (left + promptRect.width > window.innerWidth) {
                    left = window.innerWidth - promptRect.width;
                };

                prompt.style.top = `${top}px`;
                prompt.style.left = `${left}px`;
            };
            colorInput.addEventListener("click", (e)=>{colorPrompt(e)});
            colorInput.addEventListener("keydown", (e)=>{
                if (e.key == "Enter" || e.key == " ") {colorPrompt(e)}
            });

            colorInput.appendChild(colorChip);
            return colorInput;
        },
        BBinput: (params = {
            id: "",
            type: "text",
            label: "Text Input",
            labelAttributes: {},
            checked: undefined,
            value: undefined,
            round: 0,
            ticks: 3,
        })=>{
            const inputCont = document.createElement("div");
            inputCont.classList.add("USUI_M_bbContainer");

            const label = document.createElement("label");
            label.classList.add("USUI_M_bbLabel");
            label.htmlFor = params.id;
            label.textContent = params.label;
            Object.entries((params.labelAttributes ?? {})).forEach(([key,val])=>{
                label.setAttribute(key,val);
            });
            if (params.type === "color") {
                const colorMod = USUI.modules.iRGB({
                    value: params.value || "#000000"
                });
                colorMod.classList.add("USUI_M_bbInput");
                colorMod.type = params.type || "text";
                colorMod.id = params.id;
                Object.entries(params).forEach(([key,val])=>{
                    if (!["id","type","label","labelAttributes"].includes(key)) colorMod[key] = val;
                });
                inputCont.appendChild(label);
                inputCont.appendChild(colorMod);
                return [inputCont, colorMod];
            };

            const input = document.createElement("input");
            input.classList.add("USUI_M_bbInput");
            input.type = params.type || "text";
            input.id = params.id;
            Object.entries((params ?? {})).forEach(([key,val])=>{
                if (!["id","type","label","labelAttributes","round","ticks"].includes(key)) input[key] = val;
            });

            inputCont.appendChild(label);
            if (params.type != "range") {
                inputCont.appendChild(input)
            };

            if (params.type === "range") {
                inputCont.classList.add("USUI_M_bbContRange");

                const tickInpCont = document.createElement("div");
                tickInpCont.classList.add("USUI_M_bbTickInCont");
                tickInpCont.appendChild(input);
                const tickCont = document.createElement("div");
                tickCont.classList.add("USUI_M_bbTickCont");

                function createTickMark(text) {
                    const tick = document.createElement("div");
                    tick.classList.add("USUI_M_bbTick");
                    const tickSpan = document.createElement("span");
                    tickSpan.textContent = text;
                    tick.appendChild(tickSpan);
                    return tick;
                };
                function lerp(min,max,n) {
                    return min+n*(max-min);
                };
                if ("min" in params && "max" in params && params.ticks > 0) {
                    const min = Number(params.min);
                    const max = Number(params.max);
                    const total = params.ticks || 3;

                    for (let i = 0; i < total; i++) {
                        const t = i / (total - 1);
                        const value = USUI.lib.round(lerp(min, max, t), (params.round ?? 0));
                        tickCont.appendChild(createTickMark(`${value}`));
                    };

                    tickInpCont.appendChild(tickCont);
                    inputCont.appendChild(tickInpCont);
                } else {
                    inputCont.appendChild(input);
                };
            };

            return [inputCont, input];
        },
        BBbuttons: (params = {
            buttons:[
                {
                    text:"Button",
                    title:"Button",
                    action:()=>{}
                }
            ]
        })=>{
            const inputCont = document.createElement("div");
            inputCont.classList.add("USUI_M_bbContainer","USUI_M_bbButtons");

            params.buttons.forEach(btn=>{
                inputCont.appendChild(createBtn(btn));
            });

            function createBtn(params = {
                text:"Button",
                title:"Button",
                action:()=>{},
            }) {
                const button = document.createElement("button");
                button.classList.add("USUI_button");
                button.textContent = params.text || "Button";
                if (params.id) {
                    button.id = params.id;
                };
                if (params.classes) {
                    button.classList.add(...params.classes);
                };
                button.title = params.title || "Button";
                button.addEventListener("click", (e) => {
                    e.stopPropagation();
                    params.action(e);
                });
                return button;
            };

            return inputCont;
        },
    }
};