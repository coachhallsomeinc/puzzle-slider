var app = document.getElementById('app');
var arr = [];

function mkTag(tag, clss, id, style, cont) {
    let html = document.createElement(tag);
    html.setAttribute('class', clss);
    html.setAttribute('id', id);
    html.setAttribute('style', style);
    html.textContent = cont;
    return html;
}

function find(location) {
    for (let i = 0; i < arr.length; i++) {
        // console.log(arr[i].loc);
        if (arr[i].loc == location) {
            // console.log('AAAA');
            // console.log(arr[i]);
            return i;
        }
    }
}

function getH(id) {
    return document.getElementById(id);
}

function gSwap(cur) {
    var tar = arr[0].loc;
    // console.log({ '1current': arr[find(cur)], 'target': arr[find(tar)] });
    // let temp = find(cur).loc;
    // // console.log({temp});
    let curI = find(cur);
    let tarI = find(tar);
    arr[curI].loc = tar;
    arr[tarI].loc = cur;
    // console.log({ 'current': find(cur), 'target': find(tar) });
    // console.log(arr);


    arr[find(cur)].render();
    arr[find(tar)].render();

}

function locMap(rLoc) {
    // this function receives a location id as a number
    let j = rLoc % 4; // get a remainder for the column location
    let i = parseInt(rLoc / 4); // get a number for the row location
    return [i, j];  // return an array with the remainder and int
}

function proxCheck(cur) {
    let curC = locMap(cur);
    let tarC = locMap(arr[0].loc);
    if (curC[0] == tarC[0] && Math.abs(curC[1] - tarC[1]) == 1) {
        return true;
    } else if (curC[1] == tarC[1] && Math.abs(curC[0] - tarC[0]) == 1) {
        return true;
    } else {
        return false;
    }

}

function shuffle() {
    do {
        for (let j = 0; j < 500; j++) {
            let canMov = [];
            for (let i = 1; i < arr.length; i++) {
                if (proxCheck(arr[i].loc)) {
                    canMov.push(arr[i]);
                }
            }
            // console.log(canMov[Math.floor(Math.random()*canMov.length)]);
            gSwap(canMov[Math.floor(Math.random() * canMov.length)].loc);
            // setTimeout(function () {
            //     gSwap(canMov[Math.floor(Math.random() * canMov.length)].loc);
            // }, 1);
            // console.log(j);
        }
    } while (winCheck());
}


class Tile {
    constructor(tileId, loc) {
        this.tileId = tileId;
        this.loc = loc;
        this.content = mkTag('img', '', 'c' + tileId, '', 'C' + tileId);
        this.content.addEventListener('click', function () {
            // console.log(this.id);
            // console.log(this.parentElement.id);
            // console.log(arr[0].loc);
            let FRESHLoc = parseInt(this.parentElement.id);

            if (proxCheck(FRESHLoc)) {

                gSwap(FRESHLoc);
                if (winCheck()) {
                    winAlert();
                }
            }

        });

    }

    // get loc() {
    //     return this._loc;
    // }

    // set loc(freshLoc) {
    //     this._loc = freshLoc;
    // }

    render() {
        // console.log(this);
        let ht = document.getElementById(this.loc);
        ht.innerHTML = '';
        ht.appendChild(this.content);
    }
    // swap(newLoc) {
    //     // console.log(`current location:`)
    //     let curLoc = this.loc;
    //     console.log('current location of target tile');
    //     console.log(find(newLoc).loc);
    //     find(newLoc).loc = curLoc;
    //     console.log('new location of target tile:');
    //     console.log(find(newLoc).loc);

    //     // this.loc = newLoc;

    //     // find(curLoc).render();
    //     // find(newLoc).render();
    //     // console.log(arr);
    //     // console.log(document.getElementById('app'));
    // }
}

function shuffleArray(array) { // lifted straight off of stackOverflow
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// function shuffle() {
//     let locArr = [];
//     for (let i = 0; i < arr.length; i++) {
//         locArr.push(i);
//     }
//     locArr = shuffleArray(locArr);
//     // console.log(locArr);

//     for (let i = 0; i < arr.length; i++) {
//         arr[i].loc = locArr[i];
//         arr[i].render();
//     }
// }

function winAlert() {
    alert('YOU WON!');
    // alert('Don\'t you love alerts?')
    // alert('Me too!');
    // alert('I\'m glad we both appreciate taking away control from the user!');
    // alert('I wonder when Ian will put together that I set up these alerts to keep going when it detects his ip');
}

function winCheck() {
    let win = 0;
    for (let i = 0; i < arr.length; i++) {
        // console.log({ 'loc': arr[i].loc, 'id': arr[i].tileId });
        if (arr[i].loc != arr[i].tileId) {
            win++;
        }
    }
    // console.log({win});
    if (win == 0) {
        return true;
    } else {
        return false;
    }
}

function applyImg() {
    let img = document.getElementById('upload').files[0];
    let imgUrl = window.URL.createObjectURL(img);
    // console.log(imgUrl);
    for (let i = 1; i < arr.length; i++) {
        arr[i].content.setAttribute('src', imgUrl);
    }
}

function init() {
    app.innerHTML = '';

    for (let i = 0; i < 4; i++) {
        let row = mkTag('div', 'row', '', 'width:400px');
        for (let j = 0; j < 4; j++) {
            let id = i * 4 + j;
            row.appendChild(mkTag('div', 'col p-0', id, 'height:100px; width:100px; overflow: hidden;', ''))
        }
        app.appendChild(row);

    }

    // make tiles
    for (let i = 0; i < 16; i++) {
        let tile = new Tile(i, i);
        tile.render();
        arr.push(tile);
    }
    // add images
    for (let i = 1; i < arr.length; i++) {
        let coords = locMap(i);
        arr[i].content.setAttribute('src', 'https://cdn.glitch.com/168ad40a-9a6e-4f29-adbd-9440460e8fcd%2F400img.jpg?v=1586271427700');
        arr[i].content.setAttribute('style', `width: 400px; margin: -${coords[0] * 100}px 0 0 -${coords[1] * 100}px; object-fit: contain`)
        // arr[i].content.setAttribute('style', `margin: 0px 0 0 -100px; object-fit: contain`)
    }

    // reset btn
    let lastRow = mkTag('div', 'row mt-3', '', '', '');
    let btnCol = mkTag('div', 'col', '', '', '');
    let reset = mkTag('button', 'btn btn-primary', 'reset', '', 'Shuffle');
    reset.addEventListener('click', shuffle)
    btnCol.appendChild(reset);
    lastRow.appendChild(btnCol);

    // upload image ui
    let uploadCol = mkTag('div', 'col', '', '', '');
    let imgInp = mkTag('input', '', 'upload', '', '');
    imgInp.setAttribute("type", "file");

    uploadCol.appendChild(imgInp);

    lastRow.appendChild(uploadCol);

    let applyImgCol = mkTag('div', 'col', '', '', '');
    let apply = mkTag('button', 'btn btn-secondary', 'apply', '', 'Apply Image');
    apply.addEventListener('click', applyImg)
    applyImgCol.appendChild(apply);

    lastRow.appendChild(applyImgCol);

    let page = document.getElementById('page');


    page.appendChild(lastRow);
    // console.log(arr);
}

init();
