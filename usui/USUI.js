/* 
    UserScript UI
    -- made by CCN0 -- https://usui.qog.app/ -- https://github.com/ccn0/usui/ --
*/

const USUI = {
    version: "0.025beta",
    popups: [],
    defaultpos: ["0","0"],
    __position__: ["0","0"],
    __layer__: 400,
    popuptheme: "USUI_popup_T_DEFAULT",
    spawnCSS: (params = {
        overwrite:false,
        host:"https://usui.qog.app/lib/USUI.css",
    }) => {
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
        layer: USUI.__layer__,
        position: USUI.defaultpos || ["0","0"],
        buttons: [],
        title: "Popup",
        fencing: false,
        theme: "USUI_popup_T_DEFAULT",
        classes: [],
    }) => {
        const popupContainer = document.createElement("div");
        popupContainer.classList.add(
            "USUI_popup",
            USUI.popuptheme,
            ...(params.classes || []),
            ...("theme" in params ? [params.theme] : [])
        );
        popupContainer.id = params.id ?? "unknownPopup";
        if (params.stay) {
            popupContainer.style.left = USUI.position[0];
            popupContainer.style.top = USUI.position[1];
        } else {
            if ("position" in params) {
                popupContainer.style.left = params.position[0];
                popupContainer.style.top = params.position[1];
                USUI.position = [params.position[0], params.position[1]];
            } else {
                popupContainer.style.left = USUI.position[0];
                popupContainer.style.top = USUI.position[1];
                USUI.position = [...USUI.defaultpos];
            };
        };
        function incrementLayer() {
            if (!("layer" in params)) {
                USUI.__layer__++;
                popupContainer.style.zIndex = USUI.__layer__;
            } else {
                popupContainer.style.zIndex = params.layer || 400;
            };
        };
        incrementLayer();

        const popupTitlebar = document.createElement("div");
        popupTitlebar.classList.add("USUI_popuptitlebar");

        if ("buttons" in params) params.buttons.forEach((button) => {
            const tbBtn = document.createElement("button");
            tbBtn.classList.add("USUI_button", "USUI_titlebarbutton");
            tbBtn.textContent = button.text || "";
            if (button.classes) {
                tbBtn.classList.add(...button.classes);
            };
            tbBtn.addEventListener("click", (button.event || button.action));
            tbBtn.addEventListener("mousedown", (event) => {
                event.stopPropagation();
            });
            Object.entries(button).forEach(([key,val])=>{
                if (!["text","classes","event","action"].includes(key)) tbBtn[key] = val;
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
            incrementLayer();
        });

        popupTitlebar.addEventListener("touchstart", (e) => {
            isDragging = true;
            initialX = e.touches[0].clientX;
            initialY = e.touches[0].clientY;
            incrementLayer();
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

        Object.entries(params).forEach(([key,val])=>{
            if (!["stay","position","buttons","title","fencing","theme","classes","style"].includes(key)) popupContainer[key] = val;
        });
        if ("style" in params) popupContainer.style.cssText += params.style;

        popupContainer.addEventListener("mousedown",incrementLayer);
        popupContainer.addEventListener("touchstart",incrementLayer);

        popupTitlebar.appendChild(Titlespan);
        popupContainer.appendChild(popupTitlebar);
        USUI.popups.push(popupContainer)
        return popupContainer;
    },
    createPopupContent: (params = {}) => {
        const popupContent = document.createElement('div');
        popupContent.classList.add("USUI_popupcontent", "USUI_textcolor");
        Object.entries(params).forEach(([key,val])=>{
            if (![].includes(key)) popupContent[key] = val;
        });
        return popupContent;
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
                    title: "Channel"
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

                function reportInput(e) {
                    if (e.target.value.match(/[^0-9a-fA-F#]/g)) return;
                    defValues(e.target.value);
                    sliderR.value = values[0];
                    sliderG.value = values[1];
                    sliderB.value = values[2];
                    updateColor({dontupdate:["hexinput"]});
                };
                hexInput.addEventListener("input",(e)=>{
                    reportInput(e);
                });
                hexInput.addEventListener("change",(e)=>{
                    reportInput(e);
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

                colorInput.appendChild(prompt);
                sliderR.focus();
                
                function handleClickOutside(e) {
                    if (!prompt.contains(e.target)) {
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

                const inputRect = colorInput.getBoundingClientRect();
                const promptRect = prompt.getBoundingClientRect();

                let top = inputRect.bottom;
                let left = inputRect.left;

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
            Object.entries(params).forEach(([key,val])=>{
                if (!["red","green","blue","value"].includes(key)) colorInput[key] = val;
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
            tickSet: false,
            tooltip: false,
            tooltipInput: false,
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
                    if (!["id","type","label","labelAttributes","tickSet","tooltip"].includes(key)) colorMod[key] = val;
                });
                inputCont.appendChild(label);
                inputCont.appendChild(colorMod);
                return [inputCont, colorMod];
            };

            const input = document.createElement("input");
            input.classList.add("USUI_M_bbInput");
            input.type = params.type || "text";
            Object.entries((params ?? {})).forEach(([key,val])=>{
                if (!["type","label","labelAttributes","round","ticks","tickSet","tooltip"].includes(key)) input[key] = val;
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
                    if (params.tickSet) {
                        tick.classList.add("USUI_M_bbTick_set");
                        tick.addEventListener("click",()=>{
                            input.value = Number(text);
                            const inputEvent = new Event("input", { bubbles: true });
                            const changeEvent = new Event("change", { bubbles: true });

                            input.dispatchEvent(inputEvent);
                            input.dispatchEvent(changeEvent);
                        });
                    };
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
                if ("tooltip" in params) {
                    let hideTimeout = null;
                    const tooltip = document.createElement("div");
                    tooltip.classList.add("USUI_M_bbRangeTooltip");
                    tooltip.ariaHidden = true;
                    tooltip.style.display = "none";
                    tooltip.textContent = input.value;
                    inputCont.appendChild(tooltip);

                    function updateTooltipPos() {
                        const rect = input.getBoundingClientRect();
                        tooltip.style.top = `${rect.bottom}px`;
                        tooltip.style.left = `${rect.left}px`;
                    };
                    function peekVal(e,time) {
                        updateTooltipPos();
                        tooltip.textContent = e.target.value;
                        tooltip.style.display = "block";
                        if (hideTimeout) {
                            clearTimeout(hideTimeout);
                        };

                        hideTimeout = setTimeout(() => {
                            tooltip.style.display = "none";
                        }, time);
                    };

                    input.addEventListener("input",(e)=>peekVal(e,2000));
                    input.addEventListener("click",(e)=>peekVal(e,1000));
                    input.addEventListener("touchstart",(e)=>peekVal(e,1000));
                    input.addEventListener("mouseleave",(e)=>{
                        tooltip.style.display = "none";
                    });
                };
                if ("tooltipInput" in params) {
                    let hideTimeout = null;
                    const tooltip = document.createElement("input");
                    Object.entries((params ?? {})).forEach(([key,val])=>{
                        if (!["id","type","label","labelAttributes","round","ticks","tickSet","tooltip","tooltipInput"].includes(key)) tooltip[key] = val;
                    });
                    tooltip.type = "number";
                    tooltip.classList.add("USUI_M_bbRangeTooltipInput");
                    tooltip.value = input.value;
                    tooltip.ariaHidden = true;
                    tooltip.style.display = "none";
                    inputCont.appendChild(tooltip);

                    tooltip.addEventListener("input",(e)=>{
                        input.value = e.target.value;
                        const inputEvent = new Event("input", { bubbles: true });
                        const changeEvent = new Event("change", { bubbles: true });

                        input.dispatchEvent(inputEvent);
                        input.dispatchEvent(changeEvent);
                    });

                    input.addEventListener("input",(e)=>{
                        tooltip.style.display = "block";
                        const rect = input.getBoundingClientRect();
                        tooltip.style.top = `${rect.bottom}px`;
                        tooltip.style.left = `${rect.left}px`;
                        tooltip.value = e.target.value;
                        if (hideTimeout) {
                            clearTimeout(hideTimeout);
                        };

                        hideTimeout = setTimeout(() => {
                            tooltip.style.display = "none";
                        }, 1000);
                    });
                    input.addEventListener("mouseleave",()=>{
                        if (hideTimeout) {
                            clearTimeout(hideTimeout);
                        };
                        setTimeout(() => {
                            tooltip.style.display = "none";
                        }, 1000);
                    });
                    input.addEventListener("click",()=>{
                        const rect = input.getBoundingClientRect();
                        tooltip.style.top = `${rect.bottom}px`;
                        tooltip.style.left = `${rect.left}px`;
                        tooltip.style.display = "block";
                        if (hideTimeout) {
                            clearTimeout(hideTimeout);
                        };

                        hideTimeout = setTimeout(() => {
                            tooltip.style.display = "none";
                        }, 1500);
                    });
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
            const bbBCont = document.createElement("div");
            bbBCont.classList.add("USUI_M_bbContainer","USUI_M_bbButtons");
            Object.entries(params).forEach(([key,val])=>{
                if (!["buttons"].includes(key)) bbBCont[key] = val;
            });

            params.buttons.forEach(btn=>{
                bbBCont.appendChild(createBtn(btn));
            });

            function createBtn(params = {
                text:"Button",
                title:"Button",
                classes:[],
                action:()=>{},
            }) {
                const button = document.createElement("button");
                button.classList.add("USUI_button");
                Object.entries(params).forEach(([key,val])=>{
                    if (!["text","classes","action"].includes(key)) button[key] = val;
                });
                button.textContent = params.text || "Button";
                if (params.classes) {
                    button.classList.add(...params.classes);
                };
                button.addEventListener("click", (e) => {
                    e.stopPropagation();
                    params.action(e);
                });
                return button;
            };

            return bbBCont;
        },
        BBtext: (params = {
            text:"",
            title:"",
            tag:"p",
            classes:[],
        })=>{
            const bbCont = document.createElement("div");
            bbCont.classList.add("USUI_M_bbContainer","USUI_M_bbTextCont");

            const textE = document.createElement((params.tag || "p"));
            textE.classList.add("USUI_M_bbText");
            textE.textContent = params.text || "";
            if (params.classes) textE.classList.add(...params.classes);
            if ("innerHTML" in params && !("tag" in params)) {
                if (params.classes) {
                    bbCont.classList.add(...params.classes);
                };
                bbCont.innerHTML = params.innerHTML;
                return bbCont;
            };
            Object.entries(params).forEach(([key,val])=>{
                if (!["text","classes","tag"].includes(key)) textE[key] = val;
            });
            bbCont.appendChild(textE);

            return bbCont;
        },
    }
};