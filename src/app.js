import express from 'express';
import path from 'path';
import hbs from 'hbs';
import forecast from './utils/forecast.js';
import geocode from './utils/geocode.js';

const app = express();
const port = process.env.PORT || 3001;

//directory paths
const projectDir = `${path.resolve()}`;
const publicDir = path.join(projectDir, './public/');
const viewsPath = path.join(projectDir, './templates/views');
const partialsPath = path.join(projectDir, './templates/partials/');

//setting handlebars
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//setting static directory in a public folder
app.use(express.static(publicDir))

//home page
app.get('', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        name: 'Paulina Okulska'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({error: `You must provide a valid address`})
    } else {
        geocode(req.query.address, (error, {
            location,
            latitude,
            longitude
        }={}) => {
            if (error) {
                return res.send({error: `${error}`});
            }

            forecast(location, latitude, longitude, (error, {forecastImgUrl,forecastData}) => {
                if (error) {
                    return res.send({error: `${error}`});
                }
                res.send({
                    location,
                    lat:latitude,
                    long:longitude,
                    forecastImgUrl,
                    forecast:forecastData
                })
            })
        });
    }
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Paulina Okulska',
        text:'about me and the page'
    })
})

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact',
        name: 'Paulina Okulska',
        text:'about me and the page'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title:'ERROR 404',
        error: 'Page not found. Please type another url.'
    })
})

app.listen(port, console.log(`listening to port: ${port}`));