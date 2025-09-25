/* 
    DigitalKeys
    -- made by CCN0 -- https://ccn0.net/ -- https://github.com/ccn0/usui/ --
*/

class DK_Key {
    constructor(params = {
        key: "",
        shiftKey: false,
        blank:false,
        css: "",
    }) {
        this.key = params.key;
        this.css = params.css || "";
        this.display = params.display || params.key || "";
        this.img = params.img || undefined;
        this.shiftKey = params.shiftKey || false;
        this.ctrlKey = params.ctrlKey || false;
        this.altKey = params.altKey || false;
        this.metaKey = params.metaKey || false;
        this.disabled = params.disabled || false;
        this.blank = params.blank || false;
    }
};
class DK_Keyboard {
    constructor(params = {
        spans: "wide",
        keycss: "",
        rowcss: "",
        css: "",
        board: [],
    }) {
        this.css = params.css || "";
        this.rowcss = params.rowcss || "";
        this.keycss = params.keycss || "";
        this.spans = params.spans || "wide";
        this.board = params.board;
    }
};

const DK = {
    version: "0D04",
    keyboards: {},
    load: (keyboard, params = {
        bottom: "20%",
        keyHeight: "64px",
        keyFontSize: "200%",
    })=>{
        (()=>{
            if (document.querySelector('link[rel="stylesheet"][href$="dk.css"]')) return;
            const styles = document.createElement("link");
            styles.rel = "style";
            styles.href = "https://usui.qog.app/dk/dk.css";
            document.head.appendChild(styles);
        })();
        const dkcontainer = document.createElement("div");
        dkcontainer.classList.add("DK_container");
        dkcontainer.style.bottom = params.bottom;
        dkcontainer.style.cssText += keyboard.css || "";
        dkcontainer.dataset.spans = keyboard.spans;

        keyboard.board.forEach(row => {
            const rowCont = document.createElement("div");
            rowCont.classList.add("DK_row");
            rowCont.style.cssText += keyboard.rowcss || "";
            row.forEach(k=>{
                rowCont.appendChild(createKey(k))
            });
            dkcontainer.appendChild(rowCont);
        });

        document.body.appendChild(dkcontainer);

        function createKey(k) {
            const key = document.createElement("div");
            key.classList.add("DK_key");
            key.style.height = params.keyHeight;
            key.style.fontSize = params.keyFontSize;
            key.style.cssText += keyboard.keycss || "";
            key.style.cssText += k.css || "";
            key.textContent = k.display;
            if (k.display != k.key) {
                key.dataset.truedisplay = "1";
            };
            if (k.blank) {
                key.classList.add("DK_key_blank");
                return key;
            }

            let holdInterval;

            key.addEventListener("mousedown", () => {
                let rate = k.holdRate || 100;
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    key: k.key,
                    code: k.key,
                    bubbles: true,
                }));

                holdInterval = setInterval(() => {
                    document.dispatchEvent(new KeyboardEvent("keydown", {
                        key: k.key,
                        code: k.key,
                        bubbles: true,
                    }));
                }, rate);
            });
            key.addEventListener("mouseup", () => {
                clearInterval(holdInterval);
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    key: k.key,
                    code: k.key,
                    bubbles: true,
                }));
            });
            key.addEventListener("mouseleave", () => {
                clearInterval(holdInterval);
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    key: k.key,
                    code: k.key,
                    bubbles: true,
                }));
            });
            key.addEventListener("touchstart", (e) => {
                e.preventDefault();
                key.classList.add("DK_key_active");
                let rate = k.holdRate || 100;
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    key: k.key,
                    code: k.key,
                    bubbles: true,
                }));

                holdInterval = setInterval(() => {
                    document.dispatchEvent(new KeyboardEvent("keydown", {
                        key: k.key,
                        code: k.key,
                        bubbles: true,
                    }));
                }, rate);
            });
            key.addEventListener("touchend", () => {
                clearInterval(holdInterval);
                key.classList.remove("DK_key_active");
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    key: k.key,
                    code: k.key,
                    bubbles: true,
                }));
            });
            key.addEventListener("touchcancel", () => {
                clearInterval(holdInterval);
                key.classList.remove("DK_key_active");
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    key: k.key,
                    code: k.key,
                    bubbles: true,
                }));
            });
            key.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            });

            return key;
        };
    }
};
function _DK(options) {
    return new DK_Key(options);
};
DK.keyboards["qwerty"] = {
    spans: "wide",
    board:[
        [
            _DK({key:"q"}),
            _DK({key:"w"}),
            _DK({key:"e"}),
            _DK({key:"r"}),
            _DK({key:"t"}),
            _DK({key:"y"}),
            _DK({key:"u"}),
            _DK({key:"i"}),
            _DK({key:"o"}),
            _DK({key:"p"})
        ],
        [
            _DK({key:"a"}),
            _DK({key:"s"}),
            _DK({key:"d"}),
            _DK({key:"f"}),
            _DK({key:"g"}),
            _DK({key:"h"}),
            _DK({key:"j"}),
            _DK({key:"k"}),
            _DK({key:"l"})
        ],
        [
            _DK({key:"z"}),
            _DK({key:"x"}),
            _DK({key:"c"}),
            _DK({key:"v"}),
            _DK({key:"b"}),
            _DK({key:"n"}),
            _DK({key:"m"})
        ],
        [
            _DK({key:" ",display:"Space"})
        ]
    ]
};
DK.keyboards["gdcR"] = {
    spans: "wide",
    board: [
        [
            _DK({key:"1"}),
            _DK({key:"w"}),
            _DK({key:"2"}),
            _DK({key:"c",display:"BUILD"}),
            _DK({key:" ",display:"SHOOT"}),
        ],
        [
            _DK({key:"a"}),
            _DK({key:"s"}),
            _DK({key:"d"}),
            _DK({key:"r",display:"START"}),
            _DK({key:"Enter",display:"BACK"}),
        ],
    ]
};
DK.keyboards["dpad"] = {
    spans: "left",
    keycss: "font-family:monospace;font-size:300%;",
    board: [
        [
            _DK({blank:true}),
            _DK({key:"ArrowUp",display:"↑"}),
            _DK({blank:true}),
        ],
        [
            _DK({key:"ArrowLeft",display:"←"}),
            _DK({blank:true}),
            _DK({key:"ArrowRight",display:"→"}),
        ],
        [
            _DK({blank:true}),
            _DK({key:"ArrowDown",display:"↓"}),
            _DK({blank:true}),
        ],
    ]
};
DK.keyboards["face"] = {
    spans: "right",
    board: [
        [
            _DK({key:"z"}),
            _DK({key:"x"}),
        ],
    ]
};