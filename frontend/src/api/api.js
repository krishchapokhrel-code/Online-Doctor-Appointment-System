export const API = 'http://localhost:5000/api';

export const api = {
  get: (url) => fetch(API + url).then(r => r.json()),
  post: (url, body) => fetch(API + url, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(body)
  }).then(r => r.json()),
  put: (url, body) => fetch(API + url, {
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(body)
  }).then(r => r.json()),
  upload: (url, formData) => fetch(API + url, { 
    method: 'POST', 
    body: formData 
  }).then(r => r.json()),
};
