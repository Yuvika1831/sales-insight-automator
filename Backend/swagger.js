module.exports = {
openapi:"3.0.0",
info:{
title:"Sales Insight Automator API",
version:"1.0.0"
},
paths:{
"/analyze":{
post:{
summary:"Upload sales file and receive AI summary",
requestBody:{
content:{
"multipart/form-data":{}
}
},
responses:{
200:{
description:"Summary generated"
}
}
}
}
}
};