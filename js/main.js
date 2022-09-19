'use strict';

const form = document.form01;

const responseFetchContents = async (url) => {
    const response = await fetch(typeof url === 'string' ? url : false, {
        method: 'GET',
    }).catch((err) => console.log(err));
    return response.json();
}

const RenderFetchJSON = async () => {
    const response = await responseFetchContents('../json/app.json');
    const data = response;
    data.forEach(({ id, title }, index) => {
        form.insertAdjacentHTML('afterbegin', `
            <div class="app-data-container">
                <h3 class="app-data-headline">
                    ${title}
                </h3>
                <div class="app-data-apply">
                    <input type="radio" id="come-${id}-${index}" name="label${id}" value="come" class="c-checked-Radio-Come is-checked-target" required>
                    <label class="app-data-Select" for="come-${id}-${index}">はい</label>
                    <input type="radio" id="move-${id}-${index}" name="label${id}" value="move" class="c-checked-Radio-Move" required>
                    <label class="app-data-Select" for="move-${id}-${index}">いいえ</label>
                </div>
            </div>
            `);
    });
}

const RenderAnswerButton = () => {
    return document.form01.insertAdjacentHTML('beforeend', `
        <div class="app-content-Result-answerOutput-EndLine">
            <button type="button" class="app-content-Result-answerOutput-Button">判定する</button>
        </div>
    `);
}

class HealthChecker {
    constructor(root) {
        this.root = root;
        if (!this.root) {
            return;
        }

        this.targetInputRadio = this.root.querySelectorAll('input[type="radio"]');
        this.answerSendButton = this.root.querySelector('.app-content-Result-answerOutput-Button');
        this.resultOutputInner = document.querySelector('.app-content-Result-answerName-Text');
        this.radioOtherChecked = this.root.querySelectorAll('.c-checked-Radio-Come');
        this.resultCheckHead = document.querySelector('.app-content-Result-answerName-First');
        this.checkListLength = this.targetInputRadio.length / 2;

        this.touchEventListener = this._touchEventListener();

        this.init();
    }

    init() {
        this.answerSendButton.addEventListener(this.touchEventListener, (e) => {
            // console.log(e);
            this._checkInput();
        });
    }

    _checkInput() {
        let flag = false;
        let count = 0;
        for (let i = 0; i < this.radioOtherChecked.length; i++) {
            const element = this.radioOtherChecked[i];
            if (element.checked) {
                count++;
            }
        }

        for (let i = 0; i < this.root.elements.length - 1; i++) {
            const checkedAnswer = this.root.elements[i];
            if (checkedAnswer.checked === true) {
                flag = true;
                if (checkedAnswer.value === 'come' && count > this.checkListLength / 2) {
                    this._answerCorrectResultMessage('大腸がんの疑いがあるため、症状が気になるようでしたらご受診をお勧めいたします。');
                    this.resultCheckHead.classList.remove('is-hidden');
                } else if (checkedAnswer.value === 'move' && count <= this.checkListLength / 2) {
                    this._answerCorrectResultMessage('大腸がんの疑いは低いです。');
                    this.resultCheckHead.classList.remove('is-hidden');
                }
            } 
        }
        if (!flag) {
            alert('項目が選択されていません。');
        }
    }


    _answerCorrectResultMessage(answer) {
        return this.resultOutputInner.innerHTML = `<p>${typeof answer  === 'string' ? answer : false}</p>`;
    }

    _touchEventListener() {
        return window.ontouchstart ? 'touchstart' : 'click';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    RenderFetchJSON()
    RenderAnswerButton();
});

window.addEventListener('load', () => {
    setTimeout(() => {
        new HealthChecker(form);
    },400)
});