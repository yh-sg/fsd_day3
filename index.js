const express = require('express')
const hbs = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

// configure the environment
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;
const API_KEY = process.env.API_KEY || '';
const URL = 'https://api.giphy.com/v1/gifs/search'

//create an instance of express
const app = express(); 

//configure handlebars
app.engine('hbs',hbs({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

//https://api.giphy.com/v1/gifs/search
//?api_key=API_KEY
//&q=nature
//&limit=10
//&offset=0
//&rating=g
//&lang=en

//configure app

app.get('/', (req,res)=>{
    res.status(200)
    res.type('text/html')
    res.render('index')
})

app.get('/search', async(req,res)=>{

    let array = [];
    const search = req.query['serach-term']

    // console.info(search);
    //construct the url with query parameters
    const url = withQuery(
        URL,
        {
            q:search,
            api_key: API_KEY,
            limit: 10,
            offset: 0,
            rating:'g',
            lang:'en',
        }
    )

    let result = await fetch(url)

    let jsResult = await result.json();

    // console.log('giphys: \n', jsResult)

    
    for (let i = 0; i < jsResult.data.length; i++) {
        array.push(jsResult.data[i].images.fixed_height.url)
    }
    // console.log(array)

    // pull out and pass the arrays to handlebar

    return res.render('search', {
        search,
        array
    })


})

app.get('/images',(req,res)=>{
    res.render('images')
})

if(API_KEY)
    app.listen(PORT, ()=>{
        console.log(`App is running on ${PORT} at ${new Date()} key ${API_KEY}`);
    })
else
    console.error('API_KEY is not set')



