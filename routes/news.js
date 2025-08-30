
const express = require('express')
const axios = require('axios')
const newsr=express.Router()
const moment = require('moment')
const math = require('math')


newsr.get('/',async(req,res)=>{
    try {
        // Try US headlines first, then fallback to everything endpoint
        var url = 'http://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          `apiKey=${process.env.NEWS_API_KEY}`;

        const news_get = await axios.get(url)
        console.log('News API Response:', news_get.data);
        
        // If no results, try the everything endpoint with a general query
        if (news_get.data.totalResults === 0) {
            console.log('No results from top-headlines, trying everything endpoint...');
            const fallbackUrl = `http://newsapi.org/v2/everything?q=news&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;
            const fallbackResponse = await axios.get(fallbackUrl);
            console.log('Fallback API Response:', fallbackResponse.data);
            res.render('news',{articles:fallbackResponse.data.articles})
        } else {
            res.render('news',{articles:news_get.data.articles})
        }

    } catch (error) {
        console.error('Error fetching news:', error.response ? error.response.data : error.message);
        if(error.response){
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        }
        // Send a response even on error
        res.render('news',{articles:[]})
    }
})

newsr.post('/search',async(req,res)=>{
    const search=req.body.search
    console.log('Search query:', search);

    try {
        var url = `http://newsapi.org/v2/everything?q=${search}&apiKey=${process.env.NEWS_API_KEY}`

        const news_get =await axios.get(url)
        console.log('Search API Response:', news_get.data);
        res.render('news',{articles:news_get.data.articles})

    } catch (error) {
        console.error('Error searching news:', error.response ? error.response.data : error.message);
        if(error.response){
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        }
        // Send a response even on error
        res.render('news',{articles:[]})
    }
})

newsr.get('/news/:category',async(req,res)=>{
    var category = req.params.category;
    console.log('Category:', category);
    try {
        // Try US category headlines first
        var url = `http://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}`;

        const news_get = await axios.get(url)
        console.log('Category API Response:', news_get.data);
        
        // If no results, try the everything endpoint with category as search term
        if (news_get.data.totalResults === 0) {
            console.log('No results from category top-headlines, trying everything endpoint...');
            const fallbackUrl = `http://newsapi.org/v2/everything?q=${category}&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;
            const fallbackResponse = await axios.get(fallbackUrl);
            console.log('Category Fallback API Response:', fallbackResponse.data);
            res.render('category',{articles:fallbackResponse.data.articles})
        } else {
            res.render('category',{articles:news_get.data.articles})
        }

    } catch (error) {
        console.error('Error fetching category news:', error.response ? error.response.data : error.message);
        if(error.response){
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        }
        // Send a response even on error
        res.render('category',{articles:[]})
    }
})

module.exports=newsr
