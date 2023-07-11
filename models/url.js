var mongoos = require('mongoose');
mongoos.connect('mongodb://localhost:27017/ebayCrawler',{ useNewUrlParser: true, useUnifiedTopology: true });
let _url={
    url:String,
    changefreq:String,
    priority:String,
    isDone:{type:Boolean, default:false}
};
var mongoSchema = mongoos.Schema({
    dateCreated: {
        type: Date,
        default: Date.now

    },
    loc:String,
    changefreq:String,
    priority:String,
    isDone:{type:Boolean, default:false}
    
})

module.exports=mongoos.model('urlset', mongoSchema,'urlset');