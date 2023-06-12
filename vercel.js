{
    "version": 2,
    "name": "eshop",
    "builds": [
       { "src": "app.js", "use": "@vercel/node" }
    ],
    "routes": [
       { "src": "/(.*)", "dest": "/app.js" }
    ]
 }