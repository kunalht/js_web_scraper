const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

let $;
let images = [];
let page
let url = `https://icanhas.cheezburger.com`

for(var i =1; i<11;i++){
  if(i >1){
    url = `https://icanhas.cheezburger.com/page/${i}`
  }
   page = axios.get(url).then((resp) => {
    return cheerio.load(resp.data)
  }).then((data) => {
    $ = data;
    return data('.mu-content-card')
  }).then((cards) => {
     cards.each((index, ele) => {
       console.log($(ele).find('.resp-media').attr('data-src'))
      images.push($(ele).find('.resp-media').attr('data-src'))
    })
    return images;
  }).then((data) => {
    data.forEach((image, index) => {
      const fileName = image.toString();
      const filePath = path.resolve(__dirname, 'downloads', `${index}.jpg`);
      axios.get(image, {responseType: 'stream'}).then((res) => {
        let w = fs.createWriteStream(filePath)
        res.data.pipe(w);
        w.on('finish', () => {
         console.log('done')
        })
      })
    })
  })
}

