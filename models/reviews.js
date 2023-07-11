var mongoos = require('mongoose');
mongoos.connect('mongodb://localhost:27017/ebayCrawler',{ useNewUrlParser: true, useUnifiedTopology: true });

var mongoSchema = mongoos.Schema({
    dateCreated: {
        type: Date,
        default: Date.now

    },
    title:String,
    rating:Number,
    review:String,
    // isDone:{type:Boolean, default:false}
    
})

module.exports=mongoos.model('reviews', mongoSchema,'reviews');