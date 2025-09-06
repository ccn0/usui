/* 
    DigitalKeys
    -- made by CCN0 -- https://ccn0.net/ -- https://github.com/ccn0/usui/ --
*/

class DK_Key {
    constructor(params = {
        key: "",
        shiftKey: false,
    }) {
        this.key = params.key;
        this.display = params.display || params.key || "";
        this.img = params.img || undefined;
        this.shiftKey = params.shiftKey || false;
        this.ctrlKey = params.ctrlKey || false;
        this.altKey = params.altKey || false;
        this.metaKey = params.metaKey || false;
        this.disabled = params.disabled || false;
    }
}

const DK = {
    version: "0D02",
    keyboards: {
        qwerty: [
            [
                new DK_Key({key:"q"}),
                new DK_Key({key:"w"}),
                new DK_Key({key:"e"}),
                new DK_Key({key:"r"}),
                new DK_Key({key:"t"}),
                new DK_Key({key:"y"}),
                new DK_Key({key:"u"}),
                new DK_Key({key:"i"}),
                new DK_Key({key:"o"}),
                new DK_Key({key:"p"})
            ],
            [
                new DK_Key({key:"a"}),
                new DK_Key({key:"s"}),
                new DK_Key({key:"d"}),
                new DK_Key({key:"f"}),
                new DK_Key({key:"g"}),
                new DK_Key({key:"h"}),
                new DK_Key({key:"j"}),
                new DK_Key({key:"k"}),
                new DK_Key({key:"l"})
            ],
            [
                new DK_Key({key:"z"}),
                new DK_Key({key:"x"}),
                new DK_Key({key:"c"}),
                new DK_Key({key:"v"}),
                new DK_Key({key:"b"}),
                new DK_Key({key:"n"}),
                new DK_Key({key:"m"})
            ],
            [
                new DK_Key({key:" ",display:"Space"})
            ]
        ]
    },
    load: (keyboard, params = {
        bottom: "20%",
        keyHeight: "64px",
        keyFontSize: "200%",
    })=>{
        (()=>{
            if (document.querySelector('link[rel="stylesheet"][href$="dk.css"]')) return;
            const styles = document.createElement("link");
            styles.rel = "style";
            // styles.href = "https://ccn0.net/things/dk/dk.css";
            styles.href = "dk.css";
            document.head.appendChild(styles);
        })();
        const dkcontainer = document.createElement("div");
        dkcontainer.classList.add("DK_container");
        dkcontainer.style.bottom = params.bottom;

        keyboard.forEach(row => {
            const rowCont = document.createElement("div");
            rowCont.classList.add("DK_row");
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
            key.textContent = k.display;
            if (k.display != k.key) {
                key.dataset.truedisplay = "1";
            };

            let holdInterval;

            key.addEventListener("mousedown", () => {
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
                }, 100);
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

            return key;
        };
    }
};