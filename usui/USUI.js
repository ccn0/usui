/* 
    UserScript UI
    -- made by CCN0 -- https://usui.qog.app/ -- https://github.com/ccn0/usui/ --
*/

const USUI = {
    version: "0.030beta",
    popups: [],
    defaultpos: ["0","0"],
    __position__: ["0","0"],
    __layer__: 400,
    popuptheme: "USUI_popup_T_DEFAULT",
    lib: {
        round: (num, digits) => {
            return Number(num.toFixed(digits));
        },
        lerp: (min,max,n)=>{
            return min+n*(max-min);
        },
        __autoAttribute__: (disallowList = [], paramsObj, element) => {
            Object.entries(paramsObj ?? {}).forEach(([key, val]) => {
                if (disallowList.includes(key)) return;
                if (key === "dataset" && typeof val === "object") {
                    Object.entries(val).forEach(([dKey, dVal]) => {
                        element.dataset[dKey] = String(dVal);
                    });
                } else {
                    element[key] = val;
                };
            });
        },
    },
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
    closeMenu: (menu) => {
        if (typeof menu === "object" && menu instanceof HTMLElement) {
            USUI.popups.forEach(popup => {
                if (popup === menu) popup.remove();
            });
            USUI.popups = USUI.popups.filter(item => item !== menu);
        } else if (typeof menu === "string") {
            USUI.popups.forEach(popup => {
                if (popup.id === menu || popup.classList.contains(menu)) popup.remove();
            });
            USUI.popups = USUI.popups.filter(item => item.id !== menu && !item.classList.contains(menu));
        };
    },
    closeAll: ()=>{
        USUI.popups.forEach(popup => popup.remove());
        USUI.popups = [];
    },
    createDropdown: (params = {
        killers: [],
        buttons: [
            {
                text: "Button",
                title: "Button",
                action: () => {}
            }
        ]
    }) => {
        const dropdownCont = document.createElement("div");
        dropdownCont.classList.add("USUI_dropdown");
        USUI.lib.__autoAttribute__(["buttons"], params, dropdownCont);

        params.buttons?.forEach(button => {
            const btn = document.createElement("button");
            btn.classList.add("USUI_button", "USUI_dropdownbutton");
            btn.textContent = button.text || "";
            if (button.classes) btn.classList.add(...button.classes);

            btn.addEventListener("click", (e) => {
                (button.event || button.action || (() => {}))(e);
                if (!button.keepOpen) removeDropdown();
            });

            btn.addEventListener("mousedown", (e) => e.stopPropagation());
            USUI.lib.__autoAttribute__(["text", "classes", "event", "action"], button, btn);
            dropdownCont.appendChild(btn);
        });

        function removeDropdown() {
            dropdownCont.remove();
            document.removeEventListener("mousedown", clickHandler);
            params.killers?.forEach(k => k.removeEventListener?.("mousedown", clickHandler));
        };

        function clickHandler(e) {
            if (!dropdownCont.contains(e.target)) removeDropdown();
        };

        document.addEventListener("mousedown", clickHandler);
        params.killers?.forEach(killer => killer.addEventListener("mousedown", removeDropdown));

        return dropdownCont;
    },
    createPopup: (params = {
        id: "unknownPopup",
        stay: false,
        layer: USUI.__layer__,
        position: USUI.defaultpos || ["0","0"],
        titlebar: true,
        title: "Popup",
        buttons: [],
        fencing: false,
        theme: "USUI_popup_T_DEFAULT",
        handle: undefined,
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
                if (Array.isArray(params.position)) {
                    popupContainer.style.left = params.position[0];
                    popupContainer.style.top = params.position[1];
                    USUI.position = [params.position[0], params.position[1]];
                } else if (params.position == "center") {
                    const observer = new MutationObserver((mutations, obs) => {
                        if (popupContainer.isConnected) {
                            const rect = popupContainer.getBoundingClientRect();
                            const centerpos = [
                                `${(window.innerWidth / 2) - (rect.width / 2)}px`,
                                `${(window.innerHeight / 2) - (rect.height / 2)}px`
                            ];
                            popupContainer.style.left = centerpos[0];
                            popupContainer.style.top = centerpos[1];
                            USUI.position = [centerpos[0], centerpos[1]];
                            obs.disconnect();
                        };
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                } else {
                    popupContainer.style.left = USUI.defaultpos[0];
                    popupContainer.style.top = USUI.defaultpos[1];
                    USUI.position = [...USUI.defaultpos];
                };
            } else {
                popupContainer.style.left = USUI.defaultpos[0];
                popupContainer.style.top = USUI.defaultpos[1];
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
            if (button.dropdown) {
                tbBtn.addEventListener("click",(e)=>{
                    const dropdownCont = USUI.createDropdown({
                        killers:[popupTitlebar,...popupTitlebar.children],
                        buttons:button.dropdown,
                    });
                    const box = tbBtn.getBoundingClientRect();
                    dropdownCont.style.cssText = `top:${box.bottom}px;left:${box.left}px;`;
                    popupTitlebar.appendChild(dropdownCont);
                });
            } else {
                tbBtn.addEventListener("click", (button.event || button.action));
            };
            tbBtn.addEventListener("mousedown", (event) => {
                event.stopPropagation();
            });
            USUI.lib.__autoAttribute__(["text","classes","event","action"],button,tbBtn);
            popupTitlebar.appendChild(tbBtn);
        });

        const Titlespan = document.createElement("span");
        Titlespan.textContent = params.title;
        Titlespan.classList.add("USUI_titlespan");

        let isDragging = false;
        let initialX;
        let initialY;

        let handle = params.handle || popupTitlebar;
        handle.classList.add("USUI_popuphandle");

        handle.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            initialX = e.clientX;
            initialY = e.clientY;
            incrementLayer();
        });

        handle.addEventListener("touchstart", (e) => {
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

        USUI.lib.__autoAttribute__(["stay","position","buttons","title","fencing","theme","classes","style"],params,popupContainer);
        if ("style" in params) popupContainer.style.cssText += params.style;

        popupContainer.addEventListener("mousedown",incrementLayer);
        popupContainer.addEventListener("touchstart",incrementLayer);

        popupTitlebar.appendChild(Titlespan);
        if (params.titlebar !== false) {popupContainer.appendChild(popupTitlebar);}
        USUI.popups.push(popupContainer)
        return popupContainer;
    },
    createPopupContent: (params = {}) => {
        const popupContent = document.createElement('div');
        popupContent.classList.add("USUI_popupcontent", "USUI_textcolor");
        USUI.lib.__autoAttribute__([],params,popupContent);
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

                colorInput.after(prompt);
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
            USUI.lib.__autoAttribute__(["red","green","blue","value"],params,colorInput);

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
            forceNative: false,
        })=>{
            const inputCont = document.createElement("div");
            inputCont.classList.add("USUI_M_bbContainer");

            const label = document.createElement("label");
            label.classList.add("USUI_M_bbLabel");
            label.htmlFor = params.id;
            if ("label" in params && typeof params.label == "string") label.textContent = params.label;
            if ("labelAttributes" in params) USUI.lib.__autoAttribute__([],params.labelAttributes,label);
            if (params.type === "color" && !params.forceNative) {
                const toParse = {};
                if ("value" in params) toParse.value = params.value;
                if ("red" in params ||
                    "green" in params ||
                    "blue" in params) {
                        toParse.red = params.red || 0;
                        toParse.green = params.green || 0;
                        toParse.blue = params.blue || 0;
                    };
                const colorMod = USUI.modules.iRGB({...toParse});
                colorMod.classList.add("USUI_M_bbInput");
                colorMod.type = params.type || "text";
                colorMod.id = params.id;
                USUI.lib.__autoAttribute__(["id","type","label","labelAttributes","tickSet","tooltip","value","red","green","blue"],params,colorMod);
                inputCont.appendChild(label);
                inputCont.appendChild(colorMod);
                return [inputCont, colorMod];
            };

            const input = document.createElement("input");
            input.classList.add("USUI_M_bbInput");
            input.type = params.type || "text";
            USUI.lib.__autoAttribute__(["type","label","labelAttributes","round","ticks","tickSet","tooltip","forceNative"],params,input);

            if (typeof params.label !== "boolean" && params.label !== false) {
                inputCont.appendChild(label);
            };
            if (params.type == "button" || params.type == "submit") input.classList.add("USUI_button");
            if (params.type == "file") input.classList.add("USUI_fibutton");
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
                if ("min" in params && "max" in params && params.ticks > 0) {
                    const min = Number(params.min);
                    const max = Number(params.max);
                    const total = params.ticks || 3;

                    for (let i = 0; i < total; i++) {
                        const t = i / (total - 1);
                        const value = USUI.lib.round(USUI.lib.lerp(min, max, t), (params.round ?? 0));
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
            USUI.lib.__autoAttribute__(["buttons"],params,bbBCont);

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
                if ("text" in params) button.textContent = params.text;
                if (params.classes) {
                    button.classList.add(...params.classes);
                };
                button.addEventListener("click", (e) => {
                    e.stopPropagation();
                    params.action(e);
                });
                USUI.lib.__autoAttribute__(["text","classes","action"],params,button);
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
            const bbTxtCont = document.createElement("div");
            bbTxtCont.classList.add("USUI_M_bbContainer","USUI_M_bbTextCont");

            const textEl = document.createElement((params.tag || "p"));
            textEl.classList.add("USUI_M_bbText");
            textEl.textContent = params.text || "";
            if (params.classes) textEl.classList.add(...params.classes);
            if ("innerHTML" in params) {
                if (!("tag" in params)) {
                    if (params.classes) {
                        bbTxtCont.classList.add(...params.classes);
                    };
                    bbTxtCont.innerHTML = params.innerHTML;
                    return bbTxtCont;
                } else if (
                    typeof params.innerHTML === "object" &&
                    params.innerHTML instanceof HTMLElement
                ) {
                    USUI.lib.__autoAttribute__(["text","classes","tag","innerHTML"],params,bbTxtCont);
                    bbTxtCont.appendChild(params.innerHTML);
                    return bbTxtCont;
                };
            };
            USUI.lib.__autoAttribute__(["text","classes","tag"],params,textEl);
            bbTxtCont.appendChild(textEl);

            return bbTxtCont;
        },
        BBrow: (params = {
            items: [
                {
                    buttons:[
                        {
                            text:"Button",
                            title:"Button",
                            action:()=>{}
                        }
                    ]
                },
                {
                    type:"text",
                    placeholder:"Input"
                },
            ]
        })=>{
            const bbRowCont = document.createElement("div");
            bbRowCont.classList.add("USUI_M_bbContainer","USUI_M_bbRowCont");
            USUI.lib.__autoAttribute__(["items"],params,bbRowCont);
            let products = [];

            params.items.forEach(object => {
                let element = null;

                if ("text" in object) {
                    element = USUI.modules.BBtext(object);
                } else if ("type" in object) {
                    const inputSet = USUI.modules.BBinput(object);
                    element = inputSet[0];
                } else if ("buttons" in object) {
                    element = USUI.modules.BBbuttons(object);
                };
                if (!element) return;

                if (object.collapse) {
                    element.classList.add("USUI_M_collapse");
                };

                bbRowCont.appendChild(element);
                products.push(element);
            });

            return [bbRowCont, products];
        },
    }
};